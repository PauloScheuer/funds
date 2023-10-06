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
exports.insightsRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_service_1 = require("../services/database.service");
const insights_controller_1 = __importDefault(require("../controllers/insights.controller"));
exports.insightsRouter = express_1.default.Router();
exports.insightsRouter.use(express_1.default.json());
exports.insightsRouter.get("/funds", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_service_1.collections.fundsInsights) {
            throw new Error("There is no data");
        }
        const reqFilterBy = req.query.filterBy
            ? String(req.query.filterBy)
            : undefined;
        const reqOrderBy = req.query.orderBy
            ? Number(req.query.orderBy)
            : undefined;
        const reqPageNumber = req.query.pageNumber
            ? Number(req.query.pageNumber)
            : undefined;
        const reqPageSize = req.query.pageSize
            ? Number(req.query.pageSize)
            : undefined;
        const insights = yield insights_controller_1.default.getFundsInsights({
            reqFilterBy,
            reqOrderBy,
            reqPageSize,
            reqPageNumber,
        });
        res.send(JSON.stringify(insights));
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}));
exports.insightsRouter.get("/stocks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_service_1.collections.stocksInsights) {
            throw new Error("There is no data");
        }
        const reqFilterBy = req.query.filterBy
            ? String(req.query.filterBy)
            : undefined;
        const reqOrderBy = req.query.orderBy
            ? Number(req.query.orderBy)
            : undefined;
        const reqPageNumber = req.query.pageNumber
            ? Number(req.query.pageNumber)
            : undefined;
        const reqPageSize = req.query.pageSize
            ? Number(req.query.pageSize)
            : undefined;
        const insights = yield insights_controller_1.default.getStocksInsights({
            reqFilterBy,
            reqOrderBy,
            reqPageSize,
            reqPageNumber,
        });
        res.send(JSON.stringify(insights));
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}));
