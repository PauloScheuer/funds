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
exports.relationshipsRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_service_1 = require("../services/database.service");
const similarityUtils_1 = require("../utils/similarityUtils");
const relationships_controller_1 = __importDefault(require("../controllers/relationships.controller"));
exports.relationshipsRouter = express_1.default.Router();
exports.relationshipsRouter.use(express_1.default.json());
exports.relationshipsRouter.get("/funds", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_service_1.collections.relationships) {
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
        const funds = yield relationships_controller_1.default.getFunds({
            reqFilterBy,
            reqOrderBy,
            reqPageSize,
            reqPageNumber,
        });
        res.send(JSON.stringify(funds));
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}));
exports.relationshipsRouter.get("/stocks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_service_1.collections.relationships) {
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
        const stocks = yield relationships_controller_1.default.getStocks({
            reqFilterBy,
            reqOrderBy,
            reqPageSize,
            reqPageNumber,
        });
        res.send(JSON.stringify(stocks));
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}));
exports.relationshipsRouter.get("/similarFunds", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_service_1.collections.relationships) {
            throw new Error("There is no data");
        }
        const fund = req.query.fund;
        if (!fund) {
            throw new Error("The request need a fund");
        }
        const reqPageNumber = req.query.pageNumber
            ? Number(req.query.pageNumber)
            : null;
        const reqPageSize = req.query.pageSize
            ? Number(req.query.pageSize)
            : null;
        const skip = reqPageNumber ? reqPageNumber - 1 : 0;
        const limit = reqPageSize || 10;
        const allFunds = yield relationships_controller_1.default.getFunds({});
        const requestedFundIndex = allFunds.findIndex((entry) => entry.fund === fund);
        if (!allFunds[requestedFundIndex]) {
            throw new Error("Fund not found");
        }
        const requestedFund = Object.assign({}, allFunds[requestedFundIndex]);
        delete allFunds[requestedFundIndex];
        const evaluatedFunds = allFunds
            .map((entry) => {
            return Object.assign(Object.assign({}, entry), { similarity: (0, similarityUtils_1.calculateJaccardSimilarity)(requestedFund.stocks, entry.stocks) });
        })
            .sort((a, b) => b.similarity - a.similarity);
        const paginatedFunds = evaluatedFunds.splice(skip * limit, limit);
        res.send(JSON.stringify(paginatedFunds));
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}));
