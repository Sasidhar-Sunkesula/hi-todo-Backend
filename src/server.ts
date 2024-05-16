import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import todoRoutes from "./routes/todoRoutes";
import requireAuth from "./authMiddleWare/requireAuth";
import cors from "cors";
dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", todoRoutes);

app.get("/about", requireAuth, (req, res) => {
  res.json({
    msg: "ok",
  });
});

app.listen(3000, () => {
  console.log("Listening bro");
});
