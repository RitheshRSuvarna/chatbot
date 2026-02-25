import express from "express";
import dotenv from "dotenv";
import authroute from "./router/auth.routes";
import promptroute from "./router/prompt.routes";
//import historyroute from "./router/history.routes";

dotenv.config();

const app=express();

app.use(express.json());
app.use("/api/auth",authroute);
app.use("/api/prompt",promptroute);
//app.use("api//history",historyroute);

app.get("/", (req, res) =>{
    res.send("server up and running");
});

export default app;