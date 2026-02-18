import express from "express";
import dotenv from "dotenv";
import authroute from "../src/routes/auth.routes";
import promptroute from "../src/routes/prompt.routes";
import historyroute from "../src/routes/history.routes";

dotenv.config();

const app=express();

app.use(express.json());
app.use("/auth",authroutes);
app.use("/promt",promptroutes);
app.use("/history",historyroutes);

export default app;