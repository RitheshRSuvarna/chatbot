"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./router/auth.routes"));
const prompt_routes_1 = __importDefault(require("./router/prompt.routes"));
//import historyroute from "./router/history.routes";
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/prompt", prompt_routes_1.default);
//app.use("api//history",historyroute);
app.get("/", (req, res) => {
    res.send("server up and running");
});
exports.default = app;
