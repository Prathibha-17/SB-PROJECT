import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/connect.js";

import userRoutes from "./routes/userRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// database
connectDB();

// middlewares
app.use(cors());
app.use(express.json());

// default route
app.get("/", (req, res) => {
  res.send("Book Store API is running...");
});

// api routes
app.use("/api/users", userRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/admin", adminRoutes);

// server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 