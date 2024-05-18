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
exports.logout = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validator_1 = __importDefault(require("validator"));
const db_1 = __importDefault(require("../db/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
};
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, firstName, lastName, email } = req.body;
    try {
        if (username === "" || password === "" || email === "") {
            throw Error("All required fields must be filled");
        }
        if (!validator_1.default.isEmail(email)) {
            throw Error("Email not valid");
        }
        if (!validator_1.default.isStrongPassword(password)) {
            throw Error("Password is not strong enough");
        }
        const exists = yield db_1.default.user.findFirst({
            where: {
                username,
                email,
            },
        });
        if (exists) {
            throw Error("User already exists");
        }
        const salt = yield bcrypt_1.default.genSalt();
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const response = yield db_1.default.user.create({
            data: {
                username,
                password: hashedPassword,
                firstName,
                lastName,
                email,
            },
        });
        const token = createToken(response.id);
        res.cookie("jwt", token, {
            maxAge: maxAge * 1000,
            httpOnly: true,
        });
        res.status(201).json({
            data: response,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        if (username === "" || password === "") {
            throw Error("All fields must be filled");
        }
        const user = yield db_1.default.user.findFirst({
            where: {
                username,
            },
        });
        if (!user) {
            throw Error("Incorrect username");
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
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
    }
    catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});
exports.login = login;
const logout = (req, res) => {
    res.clearCookie("jwt");
    res.json({
        msg: "ok",
    });
};
exports.logout = logout;
