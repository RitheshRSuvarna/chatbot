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
exports.getChatHistory = exports.createChat = void 0;
console.log("Normal chat endpoint hit");
const chats_1 = __importDefault(require("../models/chats"));
const Gemini_1 = require("../services/Gemini");
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Endpoint hit");
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }
        const aiResponse = yield (0, Gemini_1.getAIResponse)(prompt);
        res.status(200).json({ response: aiResponse });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
exports.createChat = createChat;
const getChatHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chats = yield chats_1.default.find({ user: req.user.id }).sort({
        createdAt: -1,
    });
    res.json(chats);
});
exports.getChatHistory = getChatHistory;
