"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prompt_controller_1 = require("../controllers/prompt.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/", auth_middleware_1.protect, prompt_controller_1.createChat);
router.get("/history", auth_middleware_1.protect, prompt_controller_1.getChatHistory);
exports.default = router;
