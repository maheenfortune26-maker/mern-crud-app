# ⚡ UserVault — MERN CRUD App

A full-stack user management app built with **MongoDB, Express, React, Node.js**.

## 🗂️ Project Structure

```
mern-crud-app/
├── client/          → React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── CreateUser.jsx
│       │   ├── UpdateUser.jsx
│       │   └── UserList.jsx
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
└── server/          → Node/Express backend
    ├── models/
    │   └── User.js
    ├── routes/
    │   └── userRoutes.js
    ├── index.js
    └── .env
```

## 🚀 Getting Started

### 1. Install MongoDB locally
Download from https://www.mongodb.com/try/download/community and start it:
```bash
mongod
```

### 2. Setup the Backend
```bash
cd server
npm install
# Create .env file with:
# MONGO_URI=mongodb://127.0.0.1:27017/uservault
# PORT=5000
npm run dev
```

### 3. Setup the Frontend
```bash
cd client
npm install
npm run dev
```

### 4. Open in browser
Frontend: http://localhost:5173  
Backend API: http://localhost:5000

## 📡 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/users | Get all users |
| POST | /api/users | Create a user |
| GET | /api/users/:id | Get user by ID |
| PUT | /api/users/:id | Update a user |
| DELETE | /api/users/:id | Delete a user |

## 🛠️ Tech Stack
- **MongoDB** — Database
- **Express.js** — Backend framework
- **React.js** — Frontend library (Vite)
- **Node.js** — Runtime
- **Mongoose** — MongoDB ODM
- **Axios** — HTTP client
- **React Router v6** — Routing
