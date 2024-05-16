import express from "express";
import requireAuth from "../authMiddleWare/requireAuth";
import { addTodo, getAllTodos } from "../controllers/todoController";

const router = express.Router();

router.use(requireAuth);
router.post("/addTodo", addTodo);
router.get("/getAllTodos", getAllTodos);

export default router;