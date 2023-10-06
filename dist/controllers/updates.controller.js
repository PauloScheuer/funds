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
class UpdatesController {
    constructor() { }
    getMostRecentUpdate() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const updates = (yield ((_a = database_service_1.collections.updates) === null || _a === void 0 ? void 0 : _a.find().sort("timestamp", -1).toArray())) || [{ name: "" }];
            return ((_b = updates[0]) === null || _b === void 0 ? void 0 : _b.name) || "";
        });
    }
    insertNewUpdate(strFileName) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = database_service_1.collections.updates) === null || _a === void 0 ? void 0 : _a.insertOne({
                name: strFileName,
                timestamp: Date.now(),
            }));
        });
    }
}
exports.default = new UpdatesController();
