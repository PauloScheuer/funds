"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_service_1 = require("./services/database.service");
const relationships_router_1 = require("./routes/relationships.router");
const insights_router_1 = require("./routes/insights.router");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("hello world");
});
(0, database_service_1.connectToDatabase)().then(() => {
    app.use("/relationships", relationships_router_1.relationshipsRouter);
    app.use("/insights", insights_router_1.insightsRouter);
    app.listen(3333);
});
