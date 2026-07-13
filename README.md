# BookStore Management System (MERN Stack)

A premium, interactive bookstore web application designed with an immersive 3D floating book centerpiece, customizable cursor animations, custom 3D glassmorphism buttons, and dynamic book list tracking in Indian Rupees (₹).

## Project Structure

```
BookStore/
├── Client/      # React + Vite (Frontend UI, 3D Canvas, Pages, Components)
└── Server/      # Node.js + Express + MongoDB (Database schemas, REST APIs, Auth)
```

---

## Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally on `mongodb://localhost:27017` OR a **MongoDB Atlas** connection string.

---

### 2. Backend Setup (`Server/`)

1. Open a terminal and navigate to the `Server` directory:
   ```bash
   cd Server
   ```
2. Create or check the `.env` file (one has already been generated with defaults):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/bookstore
   JWT_SECRET=bookstore_super_secret_jwt_key_2026
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```
   *If using MongoDB Atlas, replace `MONGO_URI` with your connection string.*
3. Install dependencies:
   ```bash
   npm install
   ```
4. **Seed the database** (this will populate MongoDB with the 16 Indian & English books, test users, and orders):
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server runs on [http://localhost:5000](http://localhost:5000)*

---

### 3. Frontend Setup (`Client/`)

1. Open a **second** terminal and navigate to the `Client` directory:
   ```bash
   cd Client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client runs on [http://localhost:5173](http://localhost:5173)*

---

## Seeding & Test Credentials
When you run `npm run seed`, the following test accounts are created:

### Customer Account
- **Email**: `customer@bookstore.com`
- **Password**: `password123`

### Administrator Account
- **Email**: `admin@bookstore.com`
- **Password**: `admin123`
