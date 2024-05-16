import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  userId: number;
}
const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({
      msg: "Token not found",
    });
  }
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    (req as CustomRequest).userId = id;
    next();
  } catch (err: any) {
    res.status(401).json({
      msg: "Unauthorized request",
    });
  }
};

export default requireAuth;
