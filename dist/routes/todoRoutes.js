"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requireAuth_1 = __importDefault(require("../authMiddleWare/requireAuth"));
const todoController_1 = require("../controllers/todoController");
const router = express_1.default.Router();
router.use(requireAuth_1.default);
router.post("/addTodo", todoController_1.addTodo);
router.get("/getAllTodos", todoController_1.getAllTodos);
router.delete("/deleteTodo/:id", todoController_1.deleteTodo);
exports.default = router;
