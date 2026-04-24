import express from "express";
import db from "./db.js";
import cors from "cors";
import bodyParser from "body-parser";
import { sendTextMessage, sendBirthDayMessage } from "./message code.js";
import axios from "axios";
import env from "dotenv";
import fs from "fs";
import FormData from "form-data";
import multer from "multer";
import cron from "node-cron";

db.connect();
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.get("/", (req, res) => {
//   res.send("gym api is running");
// })
const upload = multer({ dest: "uploads/" });
//creating table for attendance
// async function createTable(){
//   const result  = await db.query(`CREATE TABLE attendance (
//     id SERIAL PRIMARY KEY,
//     member_id INT REFERENCES members(id) ON DELETE CASCADE,
//     date DATE NOT NULL,
//     status VARCHAR(10) DEFAULT 'present', -- present / absent
//     UNIQUE(member_id, date) -- prevent duplicate entry per day
// );`)
// }
// Debug endpoint - Check database connection and fees
async function uploadMedia(filePath) {
  const form = new FormData();

  form.append("file", fs.createReadStream(filePath), {
    filename: "challan.pdf",
    contentType: "application/pdf" // 🔥 IMPORTANT
  });

  form.append("messaging_product", "whatsapp");

  const response = await axios.post(
    `https://graph.facebook.com/v22.0/1040915695774969/media`,
    form,
    {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${process.env.WA_TOKEN}`,
      },
    }
  );

  return response.data.id;
}
async function sendWhatsApp(mediaId, phone) {
  console.log("sending message to whatsapp")
  await axios.post(
    `https://graph.facebook.com/v22.0/1040915695774969/messages`,
    {
      messaging_product: "whatsapp",
      to: phone,
      type: "document",
      document: {
        id: mediaId,
        filename: "challan.pdf",
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WA_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}
app.get("/debug/check", async (req, res) => {
  try {
    const fees = await db.query("SELECT * FROM fees LIMIT 10");
    const members = await db.query("SELECT * FROM members LIMIT 5");
    const plans = await db.query("SELECT * FROM membership_plan");

    res.json({
      message: "Database connected successfully",
      totalFees: fees.rowCount,
      fees: fees.rows,
      sampleMembers: members.rows,
      plans: plans.rows
    });
  } catch (err) {
    res.status(500).json({
      error: "Database connection failed",
      details: err.message
    });
  }
});

// Helper function to sync fees for the current month
const syncFees = async () => {
  try {
    const currentMonth = new Date().getMonth() + 1; // 1-indexed (Jan=1)
    const currentYear = new Date().getFullYear();

    // Find all active members who don't have a fee entry for the current month/year
    // And insert an 'unpaid' entry with the correct amount from membership_plan
    const query = `
      INSERT INTO fees (member_id, amount, month, year, status)
      SELECT m.id, 
             CASE WHEN m.admission_paid = FALSE THEN (mp.amount + m.admission_fee) ELSE mp.amount END,
             $1, $2, 'pending'
      FROM members m
      JOIN membership_plan mp ON m.plan = mp.plan_name
      LEFT JOIN fees f ON m.id = f.member_id AND f.month = $1 AND f.year = $2
      WHERE f.id IS NULL
    `;
    const result = await db.query(query, [currentMonth, currentYear]);
    console.log("Fees inserted:", result.rowCount);
  } catch (err) {
    console.error("Error syncing fees:", err);
  }
};



// Helper function to sync daily attendance
const syncDailyAttendance = async () => {
  try {
    const query = `
      INSERT INTO attendance (member_id, date, status)
      SELECT id, CURRENT_DATE, 'absent'
      FROM members
      WHERE status = 'Active'
      ON CONFLICT (member_id, date) DO NOTHING;
    `;
    await db.query(query);
    console.log("Daily attendance synced: Defaulted active members to 'absent'.");
  } catch (err) {
    console.error("Error syncing daily attendance:", err);
  }
};

// Helper function to initialize database tables
const initDb = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS challans (
        id VARCHAR(50) PRIMARY KEY,
        member_id INT REFERENCES members(id) ON DELETE CASCADE,
        amount NUMERIC NOT NULL,
        due_date DATE,
        paid_date DATE,
        payment_method VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Database initialized: ensured challans table exists.");
    await db.query(`ALTER TABLE members ADD COLUMN IF NOT EXISTS admission_fee NUMERIC DEFAULT 0;`);
    await db.query(`ALTER TABLE members ADD COLUMN IF NOT EXISTS admission_paid BOOLEAN DEFAULT FALSE;`);
    console.log("Database initialized: ensured admission columns exist in members table.");
  } catch (err) {
    console.error("Error initializing database tables:", err);
  }
};

// Run immediately on server start to ensure today's attendance is initialized
initDb();
syncDailyAttendance();

// Schedule to run every day at midnight (00:01)
cron.schedule("1 0 * * *", () => {
  console.log("Running daily attendance sync cron job...");
  syncDailyAttendance();
  checkingBirthDay()
});

async function checkingBirthDay() {
  const data = new Date();
  const month = data.getMonth() + 1;
  const day = data.getDate();
  const result = await db.query('SELECT * FROM members WHERE extract(month from dob)=$1  AND extract(day from dob)=$2', [month, day])
  if (result.rows.length > 0) {
    console.log("Birthday wishes to ", result.rows)
    result.rows.forEach(async member => {
      await sendBirthDayMessage(member.phone, member.name)
    })
  }
  else {
    console.log("No Birthday Today")
  }
}


// ==================== MEMBERS ENDPOINTS ====================

// Get all members with detailed information
app.get("/members", async (req, res) => {
  // console.log('members....')
  try {
    const result = await db.query(`
      SELECT 
        m.id,
        m.name,
        m.email,
        m.phone,
        m.address,
        m.gender,
        m.join_date as "joinDate",
        m.plan,
        m.status,
        mp.amount as fee
      FROM members m
      LEFT JOIN membership_plan mp ON m.plan = mp.plan_name
      ORDER BY m.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
})
app.get("/members/previous", async (req, res) => {
  console.log("req received")
  try {
    const result = await db.query("SELECT * FROM previous_members");
    if (result.rows.length < 0) {
      console.log("data not found");
      return res.status(404).json("data not found");
    }
    console.log(result.rwos)
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json("server error");
  }
})
// Get a single member by ID
app.get("/member/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const member = await db.query(`
      SELECT 
        m.id,
        m.name,
        m.email,
        m.phone,
        m.address,
        m.gender,
        m.join_date as "joinDate",
        m.plan,
        m.status,
        mp.amount as fee
      FROM members m
      LEFT JOIN membership_plan mp ON m.plan = mp.plan_name
      WHERE m.id=$1
    `, [id]);
    if (member.rows.length === 0) {
      return res.status(404).json({ error: "member not found" });
    }
    res.json(member.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
})

app.get("/attendance", async (req, res) => {
  // const {month}=req.query;
  // const month=4;
  const { day, month, year } = req.query;
  console.log("month: ", month, year);
  try {
    // const result= await db.query('SELECT * FROM attendance WHERE EXTRACT(MONTH FROM attendance.date)=$1 AND EXTRACT(YEAR FROM attendance.date)=$2;',[month,year]);
    const result = await db.query(`
SELECT 
  m.id,
  m.name,
  m.phone,
  a.status,
  a.check_in,
  a.check_out
FROM members m
INNER JOIN attendance a 
  ON m.id = a.member_id
  AND EXTRACT(DAY FROM a.date) = $1
  AND EXTRACT(MONTH FROM a.date) = $2
  AND EXTRACT(YEAR FROM a.date) = $3
ORDER BY m.id;
`, [day, month, year]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);

  }
})
app.post("/attendance/:id", async (req, res) => {
  const { id } = req.params;
  const status = 'present';
  console.log(id, status);
  try {
    const result = await db.query(
      `INSERT INTO attendance (member_id, status, date)
   VALUES ($1, $2, CURRENT_DATE)
   ON CONFLICT (member_id, date)
   DO UPDATE SET status = EXCLUDED.status
   RETURNING *`,
      [id, status]
    );
    const nameObj = await db.query('SELECT name FROM members WHERE id=$1', [id])
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
      console.log(nameObj.rows[0].name)
      sendTextMessage(nameObj.rows[0].name);
    } else {
      res.status(404).json("student not found");
    }

  } catch (err) {
    console.error(err);
    res.status(500).json("server error")
  }

})

// Add a new member
app.post("/member", async (req, res) => {
  try {
    const { name, email, phone, address, dob, gender, joinDate, plan, admissionFee } = req.body;
    const result = await db.query(
      "INSERT INTO members (name, email, phone, address, gender, join_date, plan, status, dob, admission_fee) VALUES ($1, $2, $3, $4, $5, $6, $7, 'Active', $8, $9) RETURNING *",
      [name, email, phone, address, gender, joinDate, plan, dob, admissionFee || 0]
    );

    // Immediately sync fees for this new member
    await syncFees();

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
})

// Update member
app.put("/members/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, gender, plan, status, dob } = req.body;
  console.log(id, name, email, phone, address, gender, plan, status, dob);
  try {
    const result = await db.query(
      "UPDATE members SET name=$1, email=$2, phone=$3, address=$4, gender=$5, plan=$6, dob=$7 WHERE id=$8 RETURNING *",
      [name, email, phone, address, gender, plan, dob, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "member not found" });
    }
    res.status(200).json({ message: "member's data updated successfully", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
})

// Delete member
app.delete("/member/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const member = await db.query("SELECT * FROM members WHERE id = $1", [id]);
    if (member.rows.length === 0) {
      return res.status(404).json({ error: "member not found" });
    }
    const { name, phone, email, address } = member.rows[0];
    // Keep archive logic as requested
    await db.query("INSERT INTO previous_members (id,name,phone,email,address) VALUES($1,$2,$3,$4,$5)", [id, name, phone, email, address]);

    await db.query("DELETE FROM members WHERE id=$1", [id]);
    res.json({ message: "member is successfully removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
})

// ==================== FEES ENDPOINTS ====================

//===================== fingerprint machine data handler=====
app.all("/iclock/cdata", async (req, res) => {
  const body = req.body;
  console.log("req received for attendance");

  if (body && body.includes("\t")) {
    const fields = body.trim().split("\t");
    const record = {
      userId: fields[0],
      timestamp: fields[1],
      verifyType: fields[2],
      status: fields[3],
    };
    // result 
    // ✅ Attendance Record: {
    // userId: '2',
    // timestamp: '2026-04-19 16:57:56',
    // verifyType: '0',
    // status: '4'
    // }
    console.log("✅ Attendance Record:", record);
    let type = "unknown";
    const nameObj = await db.query('SELECT name,phone FROM members WHERE id=$1', [record.userId])
    console.log(nameObj.rows[0].name)
    //sendTextMessage(nameObj.rows[0].name);
    if (record.status === "0") type = "check_in";
    else if (record.status === "1") type = "check_out";
    else type = "unknown";
    if (type === "check_in") {
      await db.query(
        `UPDATE attendance_sessions SET status='present', check_in=$1 WHERE user_id=$2`,
        [record.timestamp, record.userId]

      );
      sendTextMessage(nameObj.rows[0].name, type, record.timestamp, nameObj.rows[0].phone);
    }

    if (type === "check_out") {
      await db.query(
        `UPDATE attendance_sessions
     SET  check_out = $1 , status='present'
     WHERE user_id = $2 AND check_out IS NULL`,
        [record.timestamp, record.userId]
      );
      sendTextMessage(nameObj.rows[0].name, type, record.timestamp, nameObj.rows[0].phone);
    }
  }
  else {
    await db.query(
      `UPDATE attendance_sessions
     SET status='present',check_in=$1
     WHERE user_id = $2 AND check_out IS NULL`,
      [record.timestamp, record.userId]
    );
    sendTextMessage(nameObj.rows[0].name, "", record.timestamp, nameObj.rows[0].phone);
  }

  res.send("OK");
});
// Get all available month/year combinations that have fee records
app.get("/fees/periods", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT DISTINCT month, year
      FROM fees
      ORDER BY year DESC, month DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
})
app.get("/attendance/periods", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT DISTINCT 
        EXTRACT(MONTH FROM date) AS month,
        EXTRACT(YEAR FROM date) AS year
      FROM attendance
      ORDER BY year DESC, month DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// Get all fees with optional month/year filter
app.get("/fees", async (req, res) => {
  try {
    await syncFees();
    const { month, year } = req.query;
    const currentMonth = month || new Date().getMonth() + 1;
    const currentYear = year || new Date().getFullYear();

    const result = await db.query(`
      SELECT 
        f.id,
        f.member_id,
        f.amount,
        f.month,
        f.year,
        f.status,
        f.paid_date as "paidDate",
        f.refund,
        f.paymentmethod,
        m.name,
        m.email,
        m.phone
      FROM fees f
      JOIN members m ON f.member_id = m.id
      WHERE f.month = $1 AND f.year = $2
      ORDER BY f.id DESC
    `, [currentMonth, currentYear]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching fees:", err);
    res.status(500).json({ error: "server error", details: err.message });
  }
})

// Get fees for a specific member
app.get("/fees/member/:memberId", async (req, res) => {
  try {
    const { memberId } = req.params;
    const result = await db.query(`
      SELECT *
      FROM fees
      WHERE member_id = $1
      ORDER BY year DESC, month DESC
    `, [memberId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
})

// Update fee status (mark as paid)
app.patch("/fee/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Updating fee with ID:", id);
    const { member_id, month, year, method, status, paid_date } = req.body;
    console.log("feeRecord: ", member_id, month, year, method, status, paid_date)

    const result = await db.query(
      "UPDATE fees SET status='paid', paid_date=CURRENT_DATE, paymentmethod=$1 WHERE member_id=$2 AND month=$3 AND year=$4 RETURNING *",
      [method, member_id, month, year]
    );

    if (result.rows.length > 0) {
      // If payment is successful, mark admission fee as paid for this member
      await db.query("UPDATE members SET admission_paid = TRUE WHERE id = $1", [member_id]);
    }
    console.log(result.rows[0]);
    // console.log("Query result:", result.rows);

    if (result.rows.length === 0) {
      console.log("Fee not found with ID:", id);
      return res.status(404).json({ error: "Fee record not found" });
    }
    console.log("Successfully updated fee:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating fee:", err);
    res.status(500).json({ error: "server error", details: err.message });
  }
})
app.post("/send-whatsapp", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const phone = req.body.phone;

    if (!file || !phone) {
      return res.status(400).json({ error: "File or phone missing" });
    }

    // 🔥 Upload file → get media ID
    console.log("Uploading file to whatsapp server...")
    const mediaId = await uploadMedia(file.path);

    // 🔥 Send WhatsApp message
    await sendWhatsApp(mediaId);

    // (optional) delete file after sending
    fs.unlinkSync(file.path);

    res.json({
      success: true,
      message: "Challan sent on WhatsApp ✅",
      mediaId: mediaId,
    });

  } catch (err) {
    console.error(err.response?.data || err.message);

    res.status(500).json({
      success: false,
      error: "Failed to send WhatsApp ❌",
    });
  }
});

// Add new fee record
app.post("/fee", async (req, res) => {
  try {
    // const {member_id} = req.body;
    // console.log(member_id);
    const { member_id, amount, month, year, status } = req.body;
    const result = await db.query(
      "INSERT INTO fees (member_id, amount, month, year, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [member_id, amount, month, year, status || 'unpaid']
    );
    // const result = await db.query("UPDATE fees SET status='Paid' WHERE member_id=$1",[member_id] )

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
})
app.post("/fee/refund", async (req, res) => {
  try {
    const { id, month, year } = req.query
    console.log("refund ", id, month, year)
    const result = await db.query(`UPDATE fees SET refund='refunded' WHERE member_id=$1 AND month=$2 AND year=$3 RETURNING *`, [id, month, year])
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
  }
})

// ==================== CHALLAN ENDPOINTS ====================

app.get("/challans", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        c.id, 
        c.member_id as "memberId", 
        m.name as "memberName", 
        m.phone, 
        m.address, 
        c.amount, 
        TO_CHAR(c.due_date, 'YYYY-MM-DD') as "dueDate", 
        TO_CHAR(c.paid_date, 'YYYY-MM-DD') as "paidDate", 
        c.payment_method as "paymentmethod", 
        c.created_at as "createdAt"
      FROM challans c
      JOIN members m ON c.member_id = m.id
      ORDER BY c.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching challans:", err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/challan", async (req, res) => {
  try {
    const { id, memberId, amount, dueDate, paidDate, paymentmethod } = req.body;
    const result = await db.query(`
      INSERT INTO challans (id, member_id, amount, due_date, paid_date, payment_method)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [id, memberId, amount, dueDate || null, paidDate || null, paymentmethod || '']);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error saving challan:", err);
    res.status(500).json({ error: "server error" });
  }
});

// ==================== MEMBERSHIP PLANS ENDPOINTS ====================

// Get all membership plans
app.get("/membership-plans", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        plan_name as "planName",
        amount,
        description
      FROM membership_plan
      ORDER BY amount ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
})

// Update membership plan
app.put("/membership-plans/:planName", async (req, res) => {
  try {
    const { planName } = req.params;
    const { amount, description } = req.body;

    const result = await db.query(
      `UPDATE membership_plan 
       SET amount = $1, description = $2 
       WHERE plan_name = $3 
       RETURNING plan_name as "planName", amount, description`,
      [amount, description, planName]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plan not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating membership plan:", err);
    res.status(500).json({ error: "server error" });
  }
});

// ==================== AUTHENTICATION ENDPOINTS ====================

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("password to login is: ", password);
  try {
    const result = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "user not found" });
    }
    const user = result.rows[0];
    console.log(user);
    if (user.password == password) {
      res.json({ success: true, role: user.role, userId: user.id, name: user.name });
    }
    else {
      res.json({ success: false, message: "Wrong password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" })
  }
})

app.listen(3000, () => {
  console.log("server is listening on ", 3000)
})