# Fitzon Gym API Endpoints

## Base URL
`http://localhost:3000`

## Authentication

### POST /login
Login user with email and password
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "role": "admin|member|sub_admin",
    "userId": 1,
    "name": "John Doe"
  }
  ```

---

## Members Management

### GET /members
Get all members with detailed information
- **Query Parameters:** None
- **Response:** Array of member objects
  ```json
  [
    {
      "id": 1,
      "name": "Ahmed Khan",
      "email": "ahmed@gmail.com",
      "phone": "0300-1234567",
      "address": "House 12, Street 5, F-8, Islamabad",
      "joinDate": "2025-10-01",
      "plan": "Pro",
      "fee": 5500,
      "feeStatus": "Paid",
      "paidDate": "2026-04-01",
      "status": "Active"
    }
  ]
  ```

### GET /member/:id
Get a single member by ID
- **Parameters:**
  - `id` (required): Member ID
- **Response:** Single member object

### POST /member
Create a new member
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0300-1234567",
    "address": "House 1, Street 1, Islamabad",
    "joinDate": "2026-04-01",
    "plan": "Pro"
  }
  ```
- **Response:** Created member object

### PUT /members/:id
Update member information
- **Parameters:**
  - `id` (required): Member ID
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "0300-9876543",
    "address": "New Address",
    "plan": "Elite",
    "status": "Active"
  }
  ```
- **Response:** Success message with updated data

### DELETE /member/:id
Delete a member (archives to previous_members table)
- **Parameters:**
  - `id` (required): Member ID
- **Response:** Success message

---

## Fees Management

### GET /fees
Get all fees with optional month/year filter
- **Query Parameters:**
  - `month` (optional): Month number (1-12), defaults to current month
  - `year` (optional): Year, defaults to current year
- **Response:** Array of fee objects
  ```json
  [
    {
      "id": 1,
      "member_id": 1,
      "amount": 5500,
      "month": 4,
      "year": 2026,
      "status": "paid",
      "paidDate": "2026-04-01",
      "name": "Ahmed Khan",
      "email": "ahmed@gmail.com",
      "phone": "0300-1234567"
    }
  ]
  ```

### GET /fees/member/:memberId
Get all fees for a specific member
- **Parameters:**
  - `memberId` (required): Member ID
- **Response:** Array of fee records for that member

### POST /fee
Create a new fee record
- **Request Body:**
  ```json
  {
    "member_id": 1,
    "amount": 5500,
    "month": 4,
    "year": 2026,
    "status": "unpaid"
  }
  ```
- **Response:** Created fee object

### PATCH /fee/:id
Mark a fee as paid
- **Parameters:**
  - `id` (required): Fee ID
- **Response:** Updated fee object with status='paid' and current date as paid_date

---

## Membership Plans

### GET /membership-plans
Get all available membership plans
- **Response:**
  ```json
  [
    {
      "planName": "Basic",
      "amount": 3000,
      "description": "Basic membership"
    },
    {
      "planName": "Pro",
      "amount": 5500,
      "description": "Professional membership"
    },
    {
      "planName": "Elite",
      "amount": 9000,
      "description": "Elite membership"
    }
  ]
  ```

---

## Classes Management

### GET /classes
Get all available classes
- **Response:**
  ```json
  [
    {
      "id": 1,
      "name": "Weightlifting",
      "trainer": "David Goggins",
      "time": "06:00 AM - 07:30 AM",
      "days": "Mon, Wed, Fri",
      "capacity": 30,
      "enrolled": 18,
      "description": "Strength training class"
    }
  ]
  ```

### GET /class/:id
Get a single class by ID
- **Parameters:**
  - `id` (required): Class ID
- **Response:** Single class object

### PUT /class/:id
Update class information
- **Parameters:**
  - `id` (required): Class ID
- **Request Body:**
  ```json
  {
    "name": "Weightlifting",
    "trainer": "New Trainer",
    "time": "07:00 AM - 08:30 AM",
    "days": "Tue, Thu, Sat",
    "capacity": 35,
    "description": "Updated description"
  }
  ```
- **Response:** Updated class object

---

## Error Responses

All endpoints return error responses in the following format:
```json
{
  "error": "Error message"
}
```

---

## Database Tables Required

- `users` - User accounts (email, password, role, name)
- `members` - Gym members (name, email, phone, address, join_date, plan, status)
- `membership_plan` - Available plans (plan_name, amount, description)
- `fees` - Fee records (member_id, amount, month, year, status, paid_date)
- `classes` - Gym classes (name, trainer, time, days, capacity, enrolled, description)
- `previous_members` - Archived members (id, name, phone)

---

## Starting the Server

```bash
npm install
npm run dev
```

The API will be available at `http://localhost:3000`
