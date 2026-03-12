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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ragService = void 0;
const retriver_service_1 = require("./retriver.service");
const Gemini_1 = require("../Gemini");
exports.ragService = {
    getAIResponse(history) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = history[history.length - 1].parts[0].text;
            // retrieve relevant document chunks
            const context = yield (0, retriver_service_1.retrieveContext)(query);
            const augmentedPrompt = `
Context:
${context}

Question:
${query}
`;
            history[history.length - 1].parts[0].text = augmentedPrompt;
            return yield (0, Gemini_1.getAIResponse)(history);
        });
    }
};
