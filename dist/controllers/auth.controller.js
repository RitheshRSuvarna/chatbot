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
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const userExists = yield user_1.default.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const User = yield user_1.default.create({
        name,
        email,
        password: hashedPassword,
    });
    res.status(201).json({
        // _id: User._id,
        // name: User.name,
        // email: User.email,
        token: generateToken(User._id.toString()),
    });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const User = yield user_1.default.findOne({ email });
    if (User && (yield bcrypt_1.default.compare(password, User.password))) {
        res.json({ message: "Login Successful"
            //   // _id: User._id,
            //   // name: User.name,
            //   // email: User.email,
            //   // token: generateToken(User._id.toString()),
        });
    }
    else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});
exports.login = login;
