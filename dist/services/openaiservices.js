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
exports.streamAIResponse = exports.getAIResponse = void 0;
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log("USING NEW SDK");
const ai = new genai_1.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
const getAIResponse = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const response = yield ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
    });
    return (_a = response.text) !== null && _a !== void 0 ? _a : "";
});
exports.getAIResponse = getAIResponse;
const streamAIResponse = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
        });
        return (_a = result.text) !== null && _a !== void 0 ? _a : "";
    }
    catch (error) {
        console.error("FULL GEMINI ERROR:", error);
        throw error;
    }
});
exports.streamAIResponse = streamAIResponse;
