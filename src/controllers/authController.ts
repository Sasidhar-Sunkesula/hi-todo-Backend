import jwt from "jsonwebtoken";
import validator from "validator";
import { Request, Response } from "express";
import client from "../db/db";
import bcrypt from "bcrypt";

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: maxAge,
  });
};

export const signup = async (req: Request, res: Response) => {
  console.log(req.body);
  const { username, password, firstName, lastName, email } = req.body;
  try {
    if (username === "" || password === "" || email === "") {
      throw Error("All required fields must be filled");
    }
    if (!validator.isEmail(email)) {
      throw Error("Email not valid");
    }
    if (!validator.isStrongPassword(password)) {
      throw Error("Password is not strong enough");
    }
    const exists = await client.user.findFirst({
      where: {
        username,
        email,
      },
    });
    if (exists) {
      throw Error("User already exists");
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const response = await client.user.create({
      data: {
        username,
        password: hashedPassword,
        firstName,
        lastName,
        email,
      },
    });
    console.log(response);
    const token = createToken(response.id);
    res.cookie("jwt", token, {
      maxAge: maxAge * 1000,
      httpOnly: true,
    });
    res.status(201).json({
      data: response,
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    if (username === "" || password === "") {
      throw Error("All fields must be filled");
    }
    const user = await client.user.findFirst({
      where: {
        username,
      },
    });
    if (!user) {
      throw Error("Incorrect username");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw Error("Incorrect password");
    }

    const token = createToken(user.id);
    res.cookie("jwt", token, {
      maxAge: maxAge * 1000,
      httpOnly: true,
    });
    res.json({
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("jwt");
  res.json({
    msg: "ok",
  });
};

