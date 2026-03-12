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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatHistory = exports.createChat = void 0;
console.log("Normal chat endpoint hit");
const RAGservice_1 = require("../services/Rag/RAGservice");
const chats_1 = __importDefault(require("../models/chats"));
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    var _d;
    try {
        const { prompt, _id } = req.body;
        if (!prompt) {
            return res.status(400).json({ message: "prompt is required" });
        }
        // find chat
        let chat = _id ? yield chats_1.default.findById(_id) : null;
        // build history from previous messages
        const history = (chat === null || chat === void 0 ? void 0 : chat.messages.map((msg) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
        }))) || [];
        history.unshift({
            role: "system",
            parts: [{ text: "You are an useful assistant who gives short answers for the queries" }]
        });
        // add current prompt
        history.push({
            role: "user",
            parts: [{ text: prompt }],
        });
        // send conversation to Gemini
        const stream = yield RAGservice_1.ragService.getAIResponse(history);
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        (_d = res.flushHeaders) === null || _d === void 0 ? void 0 : _d.call(res);
        let fullResponse = "";
        console.log("Stream received from Gemini:");
        try {
            // stream response
            for (var _e = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a; _e = true) {
                _c = stream_1_1.value;
                _e = false;
                const chunk = _c;
                if (typeof chunk === "object" && chunk.text) {
                    fullResponse += chunk.text;
                    res.write(`data: ${chunk.text}\n\n`);
                }
                else if (typeof chunk === "string") {
                    fullResponse += chunk;
                    res.write(`data: ${chunk}\n\n`);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_e && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // if chat doesn't exist → create new chat
        if (!chat) {
            chat = yield chats_1.default.create({
                user: req.user.id,
                messages: [
                    { role: "users", content: prompt },
                    { role: "assistant", content: fullResponse },
                ],
            });
        }
        // otherwise update existing chat
        else {
            yield chats_1.default.updateOne({ _id }, {
                $push: {
                    messages: {
                        $each: [
                            { role: "user", content: prompt },
                            { role: "assistant", content: fullResponse },
                        ],
                    },
                },
            });
        }
        res.write("data: [DONE]\n\n");
        res.end();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
exports.createChat = createChat;
const getChatHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = yield chats_1.default.find({ user: req.user.id }).sort({
            createdAt: -1,
        });
        res.json(chats);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getChatHistory = getChatHistory;
