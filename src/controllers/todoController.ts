import { Request, Response } from "express";
import { CustomRequest } from "../authMiddleWare/requireAuth";
import client from "../db/db";

interface BodyType {
  title: string;
  description: string;
}

export const addTodo = async (req: CustomRequest, res: any) => {
  const userId = req.userId;
  const { title, description }: BodyType = req.body;
  if (title === "" || description === "") {
    return res.status(400).json({
      msg: "Can't add empty todo",
    });
  }
  try {
    const data = await client.todo.create({
      data: {
        title,
        description,
        userId,
      },
    });
    res.status(201).json({ data });
  } catch (err: any) {
    res.status(401).json({
      error: err.message,
    });
  }
};

export const getAllTodos = async (req: CustomRequest, res: any) => {
  const userId = req.userId;
  try {
    const todos = await client.todo.findMany({
      where: {
        userId,
      },
    });
    res.json({
      todos,
    });
  } catch (err: any) {
    res.status(401).json({
      error: err.message,
    });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const response = await client.todo.delete({
      where: {
        id: parseInt(id, 10),
      },
    });
    res.json({
      data: response,
    });
  } catch (err: any) {
    res.status(404).json({
      error: err.message,
    });
  }
};
