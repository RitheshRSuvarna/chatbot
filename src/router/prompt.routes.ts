import express from "express";
import { createChat, getChatHistory } from "../controllers/prompt.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", protect, createChat);
router.get("/history", protect, getChatHistory);

export default router;
export{};