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
const chats_1 = __importDefault(require("../models/chats"));
const openaiservices_1 = require("../services/openaiservices");
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt } = req.body;
    const aiResponse = yield (0, openaiservices_1.getAIResponse)(prompt);
    const chat = yield chats_1.default.create({
        user: req.user.id,
        prompt,
        response: aiResponse,
    });
    res.json(chat);
});
exports.createChat = createChat;
const getChatHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chats = yield chats_1.default.find({ user: req.user.id }).sort({
        createdAt: -1,
    });
    res.json(chats);
});
exports.getChatHistory = getChatHistory;
