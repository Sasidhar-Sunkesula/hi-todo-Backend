import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import todoRoutes from "./routes/todoRoutes";
import requireAuth, { CustomRequest } from "./authMiddleWare/requireAuth";
import prisma from "./db/db";
import cors from "cors";
dotenv.config();
const app = express();

app.use(
  cors({
    origin: "https://hi-darling.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", todoRoutes);

app.get(
  "/api/getUserDetails",
  requireAuth,
  async (req: CustomRequest, res: any) => {
    const id = req.userId;
    try {
      const data = await prisma.user.findFirst({
        where: {
          id,
        },
      });
      res.json({
        data,
      });
    } catch (err: any) {
      res.status(401).json({
        error: err.message,
      });
    }
  }
);
app.listen(3000, () => {
  console.log("Listening bro");
});
