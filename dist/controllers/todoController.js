"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.getAllTodos = exports.addTodo = void 0;
const db_1 = __importDefault(require("../db/db"));
const addTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { title, description } = req.body;
    if (title === "" || description === "") {
        return res.status(400).json({
            msg: "Can't add empty todo",
        });
    }
    try {
        const data = yield db_1.default.todo.create({
            data: {
                title,
                description,
                userId,
            },
        });
        res.status(201).json({ data });
    }
    catch (err) {
        res.status(401).json({
            error: err.message,
        });
    }
});
exports.addTodo = addTodo;
const getAllTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const todos = yield db_1.default.todo.findMany({
            where: {
                userId,
            },
        });
        res.json({
            todos,
        });
    }
    catch (err) {
        res.status(401).json({
            error: err.message,
        });
    }
});
exports.getAllTodos = getAllTodos;
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const response = yield db_1.default.todo.delete({
            where: {
                id: parseInt(id, 10),
            },
        });
        res.json({
            data: response,
        });
    }
    catch (err) {
        res.status(404).json({
            error: err.message,
        });
    }
});
exports.deleteTodo = deleteTodo;
