import { CustomRequest } from "../authMiddleWare/requireAuth";
import client from "../db/db";

interface BodyType {
  title: string;
  description: string;
}

export const addTodo = async (req: CustomRequest, res: any) => {
  const userId = req.userId;
  const { title, description }: BodyType = req.body;
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
    const data = await client.todo.findMany({
      where: {
        userId,
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
};
