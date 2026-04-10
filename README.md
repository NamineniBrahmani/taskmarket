# 🚀 TaskMarket – Smart Task Marketplace

TaskMarket is a full-stack web application that connects **task posters** with **workers**.
Users can create tasks, place bids, assign work, communicate, verify via OTP, and securely release payments.

---

## 🌟 Features

### 👤 Authentication

* User registration & login (JWT-based)
* Role selection: **Poster** or **Worker**

### 📌 Task Management

* Create tasks with title, description, budget & deadline
* View all available tasks
* Filter & sort tasks

### 💰 Bidding System

* Workers can place bids on tasks
* Posters can view all bids
* Assign task to the best bidder

### 💬 Real-Time Chat

* Chat between poster and assigned worker
* Auto-refresh messages

### 🔐 OTP Verification

* Poster generates OTP
* Worker verifies OTP before starting task

### ✅ Task Workflow

* Assigned → In Progress → Completed
* Worker marks task complete

### 💳 Payment System

* Poster releases payment after completion
* Wallet system updates balances

### 📊 Dashboard

* View stats: total, completed, in-progress tasks
* Wallet balance display

---

## 🛠 Tech Stack

### Frontend

* React.js
* React Router
* Axios
* CSS (Glassmorphism UI)

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

### Deployment

* Backend: Render
* Database: MongoDB Atlas

---

## 📁 Project Structure

```
taskmarket/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── styles/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── utils/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/taskmarket.git
cd taskmarket
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
PORT=5000
```

Run backend:

```bash
npm start
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🔄 Application Flow

```
Register → Login → Select Role
→ Create Task → Place Bid
→ Assign Worker → Generate OTP
→ Verify OTP → Complete Task
→ Release Payment
```

---

## 🧪 Testing Steps

1. Register 2 users
2. Login as Poster → Create Task
3. Login as Worker → Place Bid
4. Poster → Assign Task
5. Generate OTP
6. Worker → Verify OTP
7. Complete Task
8. Poster → Release Payment

---

## ⚠️ Known Issues (Fixed)

* Bid assignment mismatch (userId vs bidder)
* MongoDB ObjectId comparison issues
* Chat message visibility bug
* OTP flow visibility issues

---

## 🚀 Future Enhancements

* Real-time chat using WebSockets
* Notifications system
* Rating & review system
* Payment gateway integration
* Mobile app version

---

## 👩‍💻 Author

**Brahmani Namineni**

---

## 📌 License

This project is for educational and development purposes.
