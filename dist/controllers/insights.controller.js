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
const database_service_1 = require("../services/database.service");
class InsightsController {
    constructor() { }
    getStocksInsights({ reqFilterBy, reqOrderBy, reqPageSize, reqPageNumber, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!database_service_1.collections.stocksInsights) {
                return [];
            }
            const match = reqFilterBy
                ? {
                    $or: [
                        { "first.key": new RegExp(`.*${reqFilterBy.toUpperCase()}.*`) },
                        { "first.name": new RegExp(`.*${reqFilterBy.toUpperCase()}.*`) },
                        { "second.key": new RegExp(`.*${reqFilterBy.toUpperCase()}.*`) },
                        { "second.name": new RegExp(`.*${reqFilterBy.toUpperCase()}.*`) },
                    ],
                }
                : {};
            const orderBy = { frequency: reqOrderBy || -1 };
            const limit = reqPageSize;
            const skip = (reqPageNumber ? reqPageNumber - 1 : 0) * (limit || 0);
            const pipeline = [];
            match && pipeline.push({ $match: match });
            orderBy && pipeline.push({ $sort: orderBy });
            skip && pipeline.push({ $skip: skip });
            limit && pipeline.push({ $limit: limit });
            return yield database_service_1.collections.stocksInsights.aggregate(pipeline).toArray();
        });
    }
    refreshStocksInsights(insights) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!(insights === null || insights === void 0 ? void 0 : insights.length)) {
                    return;
                }
                yield ((_a = database_service_1.collections.stocksInsights) === null || _a === void 0 ? void 0 : _a.drop({}));
            }
            catch (e) {
                console.log("delete error", e === null || e === void 0 ? void 0 : e.message);
            }
            try {
                const promises = [];
                let bulkOps = [];
                insights.forEach((insight) => {
                    var _a;
                    bulkOps.push({ insertOne: { document: insight } });
                    if (bulkOps.length === 1000) {
                        promises.push((_a = database_service_1.collections.stocksInsights) === null || _a === void 0 ? void 0 : _a.bulkWrite(bulkOps));
                        bulkOps = [];
                    }
                });
                if (bulkOps.length > 0) {
                    promises.push((_b = database_service_1.collections.stocksInsights) === null || _b === void 0 ? void 0 : _b.bulkWrite(bulkOps));
                }
                yield Promise.all(promises);
            }
            catch (e) {
                console.log("insert error", e === null || e === void 0 ? void 0 : e.message);
            }
        });
    }
    getFundsInsights({ reqFilterBy, reqOrderBy, reqPageSize, reqPageNumber, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!database_service_1.collections.fundsInsights) {
                return [];
            }
            const match = reqFilterBy
                ? {
                    $or: [
                        { "first.key": new RegExp(`.*${reqFilterBy.toUpperCase()}.*`) },
                        { "first.name": new RegExp(`.*${reqFilterBy.toUpperCase()}.*`) },
                        { "second.key": new RegExp(`.*${reqFilterBy.toUpperCase()}.*`) },
                        { "second.name": new RegExp(`.*${reqFilterBy.toUpperCase()}.*`) },
                    ],
                }
                : {};
            const orderBy = { frequency: reqOrderBy || -1 };
            const limit = reqPageSize;
            const skip = (reqPageNumber ? reqPageNumber - 1 : 0) * (limit || 0);
            const pipeline = [];
            match && pipeline.push({ $match: match });
            orderBy && pipeline.push({ $sort: orderBy });
            skip && pipeline.push({ $skip: skip });
            limit && pipeline.push({ $limit: limit });
            return yield database_service_1.collections.fundsInsights.aggregate(pipeline).toArray();
        });
    }
    refreshFundsInsights(insights) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!(insights === null || insights === void 0 ? void 0 : insights.length)) {
                    return;
                }
                yield ((_a = database_service_1.collections.fundsInsights) === null || _a === void 0 ? void 0 : _a.drop({}));
            }
            catch (e) {
                console.log("delete error", e === null || e === void 0 ? void 0 : e.message);
            }
            try {
                const promises = [];
                let bulkOps = [];
                insights.forEach((insight) => {
                    var _a;
                    bulkOps.push({ insertOne: { document: insight } });
                    if (bulkOps.length === 1000) {
                        promises.push((_a = database_service_1.collections.fundsInsights) === null || _a === void 0 ? void 0 : _a.bulkWrite(bulkOps));
                        bulkOps = [];
                    }
                });
                if (bulkOps.length > 0) {
                    promises.push((_b = database_service_1.collections.fundsInsights) === null || _b === void 0 ? void 0 : _b.bulkWrite(bulkOps));
                }
                yield Promise.all(promises);
            }
            catch (e) {
                console.log("insert error", e === null || e === void 0 ? void 0 : e.message);
            }
        });
    }
}
exports.default = new InsightsController();
