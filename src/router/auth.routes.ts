import express from "express";
import { register, login } from "../controllers/auth.controller";

const router = express.Router();

console.log("REGISTER TYPE:", typeof register);
console.log("REGISTER VALUE:", register);
router.post("/register", register);
router.post("/login", login);

export default router;