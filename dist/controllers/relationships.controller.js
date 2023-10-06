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
class RelationshipsController {
    constructor() { }
    getFunds({ reqFilterBy, reqOrderBy, reqPageSize, reqPageNumber, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!database_service_1.collections.relationships) {
                return [];
            }
            const match = reqFilterBy
                ? {
                    $or: [
                        {
                            fund: {
                                $regex: reqFilterBy.toLocaleUpperCase().replace(".", "\\."),
                            },
                        },
                        {
                            fundPretty: {
                                $regex: reqFilterBy.toLocaleUpperCase().replace(".", "\\."),
                            },
                        },
                    ],
                }
                : {};
            const orderBy = { fund: reqOrderBy || 1 };
            const limit = reqPageSize;
            const skip = (reqPageNumber ? reqPageNumber - 1 : 0) * (limit || 0);
            const pipeline = [
                {
                    $group: {
                        _id: "$fund",
                        fundPretty: { $first: "$fundPretty" },
                        stocks: { $push: "$stock" },
                        stocksPretty: { $push: "$stockPretty" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        fund: "$_id",
                        fundPretty: 1,
                        stocks: 1,
                        stocksPretty: 1,
                    },
                },
            ];
            match && pipeline.push({ $match: match });
            orderBy && pipeline.push({ $sort: orderBy });
            skip && pipeline.push({ $skip: skip });
            limit && pipeline.push({ $limit: limit });
            return yield database_service_1.collections.relationships.aggregate(pipeline).toArray();
        });
    }
    getStocks({ reqFilterBy, reqOrderBy, reqPageSize, reqPageNumber, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!database_service_1.collections.relationships) {
                return [];
            }
            const match = reqFilterBy
                ? {
                    $or: [
                        { stock: new RegExp(`.*${reqFilterBy.toLocaleUpperCase()}.*`) },
                        {
                            stockPretty: new RegExp(`.*${reqFilterBy.toLocaleUpperCase()}.*`),
                        },
                    ],
                }
                : {};
            const orderBy = { stock: reqOrderBy || 1 };
            const limit = reqPageSize;
            const skip = (reqPageNumber ? reqPageNumber - 1 : 0) * (limit || 0);
            const pipeline = [
                {
                    $group: {
                        _id: "$stock",
                        stockPretty: { $first: "$stockPretty" },
                        funds: { $push: "$fund" },
                        fundsPretty: { $push: "$fundPretty" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        stock: "$_id",
                        stockPretty: 1,
                        funds: 1,
                        fundsPretty: 1,
                    },
                },
            ];
            match && pipeline.push({ $match: match });
            orderBy && pipeline.push({ $sort: orderBy });
            skip && pipeline.push({ $skip: skip });
            limit && pipeline.push({ $limit: limit });
            return yield database_service_1.collections.relationships.aggregate(pipeline).toArray();
        });
    }
    refreshPairs(pairs) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = database_service_1.collections.relationships) === null || _a === void 0 ? void 0 : _a.deleteMany({}));
            yield ((_b = database_service_1.collections.relationships) === null || _b === void 0 ? void 0 : _b.insertMany(pairs));
        });
    }
}
exports.default = new RelationshipsController();
