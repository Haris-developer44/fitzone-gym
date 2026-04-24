import axios from "axios";
import env from "dotenv";
import fs from "fs";
import FormData from "form-data";
env.config();

const sendBirthDayMessage = async (phone, name) => {
  try {
    console.log("posting request to whatsapp.....");
    const response = await axios({
      url: 'https://graph.facebook.com/v22.0/1040915695774969/messages',
      method: 'post',
      headers: {
        'Authorization': `Bearer ${process.env.WA_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: {
          body: `On behalf of Fitzon Gym we wish you a very happy birthday ${name}`,
        }
      })
    })
    // console.log("response data: ", response.data);
  } catch (err) {
    console.error(err);
  }
}

const sendTextMessage = async (name, type, time, phone) => {
  try {
    console.log("posting request to whatsapp.....");
    console.log(name, type, time, phone);
    const response = await axios({
      url: 'https://graph.facebook.com/v22.0/1040915695774969/messages',
      method: 'post',
      headers: {
        'Authorization': `Bearer ${process.env.WA_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: {
          body: `*${type.toUpperCase()}* \n\n *Assalamualaikum*,${name}\n Your attendance is marked as Present at *${time}*\n\n Regards: *Fitzon Gym*`,
        }
      })
    })
  } catch (err) {
    console.error(err);
  }
}

// sendTextMessage();









export { sendTextMessage, sendBirthDayMessage };