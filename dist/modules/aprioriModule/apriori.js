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
exports.createRecomendations = void 0;
const relationships_controller_1 = __importDefault(require("../../controllers/relationships.controller"));
const database_service_1 = require("../../services/database.service");
const twoWayMap_1 = __importDefault(require("./twoWayMap"));
const effectiveSet_1 = __importDefault(require("./effectiveSet"));
const collection_1 = __importDefault(require("./collection"));
const insights_controller_1 = __importDefault(require("../../controllers/insights.controller"));
const dictKeys = new twoWayMap_1.default();
const dictNames = new Map();
function apriori(items, threshold) {
    let levelZeroCollection = new collection_1.default();
    items.forEach((transaction) => {
        transaction.forEach((value) => {
            levelZeroCollection.add(`${value}`);
        });
    });
    levelZeroCollection.cut(threshold);
    const collections = [levelZeroCollection];
    let filteredItems = items.map((item) => {
        return new effectiveSet_1.default(item);
    });
    let k = 1;
    while (collections[k - 1].size > 0) {
        const lastCollection = collections[k - 1];
        const kCollection = new collection_1.default();
        const candidates = generateCandidates(lastCollection);
        const foundedIndexes = new Set();
        candidates.forEach((candidate, i) => {
            filteredItems.forEach((transaction, j) => {
                const bIsCandidateInTransaction = candidate.items.every((element) => {
                    return transaction.has(element);
                });
                if (bIsCandidateInTransaction) {
                    kCollection.add(candidate.key);
                    foundedIndexes.add(j);
                }
            });
        });
        const newFilteredItems = [];
        filteredItems.forEach((item, i) => {
            if (foundedIndexes.has(i)) {
                newFilteredItems.push(item);
            }
        });
        filteredItems = [...newFilteredItems];
        kCollection.cut(threshold);
        collections.push(kCollection);
        k++;
    }
    return collections.splice(0, collections.length - 1);
}
function generateCandidates(lastCollection) {
    const candidates = [];
    const items = lastCollection.getItems();
    for (let i = 0; i < items.length; i++) {
        const item1 = items[i];
        for (let j = i + 1; j < items.length; j++) {
            const item2 = items[j];
            let canBeCombined = true;
            const limit = item1.length - 1;
            for (let k = 0; k < limit; k++) {
                if (item1[k] !== item2[k]) {
                    canBeCombined = false;
                    break;
                }
            }
            if (canBeCombined) {
                candidates.push([...item1, item2[item2.length - 1]]);
            }
            else {
                break;
            }
        }
    }
    return candidates.map((candidate) => {
        return {
            items: candidate,
            key: candidate.join("_"),
        };
    });
}
function generateRulesForItem(allRules, minFrequency, elements, originalPartOne, collections, originalFrequency, level, startK, stopLevel) {
    if (level === stopLevel - 1) {
        return;
    }
    for (let k = startK; k < elements.length; k++) {
        const newElements = [...elements];
        const newElement = newElements.splice(k, 1);
        const partOne = [...originalPartOne, ...newElement];
        const partTwo = [...newElements];
        const partOneKey = partOne.join("_");
        const partTwoKey = partTwo.join("_");
        const partOneFrequency = originalFrequency /
            collections[partOne.length - 1].getFrequency(partOneKey);
        const partTwoFrequency = originalFrequency / collections[level - 1].getFrequency(partTwoKey);
        if (partOneFrequency >= minFrequency) {
            allRules.push({
                first: partOne,
                second: partTwo,
                frequency: partOneFrequency,
            });
        }
        if (partTwoFrequency >= minFrequency) {
            allRules.push({
                first: partTwo,
                second: partOne,
                frequency: partTwoFrequency,
            });
        }
        generateRulesForItem(allRules, minFrequency, partTwo, partOne, collections, originalFrequency, level - 1, k, stopLevel);
        if (stopLevel === 1) {
            break;
        }
    }
}
function generateAllRules(collections, minFrequency) {
    const allRules = [];
    for (let i = 1; i < collections.length; i++) {
        const collection = collections[i];
        const items = collection.getItems();
        const keys = collection.getKeys();
        for (let j = 0; j < items.length; j++) {
            const key = keys[j];
            const elements = items[j];
            const thisFrequency = collection.getFrequency(key);
            const nStopLevel = Math.ceil(elements.length / 2);
            generateRulesForItem(allRules, minFrequency, elements, [], collections, thisFrequency, i, 0, nStopLevel);
        }
    }
    const allRulesValues = allRules.map((rule) => {
        return {
            first: rule.first.map((id) => {
                return {
                    key: dictKeys.getValue(id),
                    name: dictNames.get(id) || "",
                };
            }),
            second: rule.second.map((id) => {
                return {
                    key: dictKeys.getValue(id),
                    name: dictNames.get(id) || "",
                };
            }),
            frequency: rule.frequency,
        };
    });
    return allRulesValues;
}
function createStocksRecomendations() {
    return __awaiter(this, void 0, void 0, function* () {
        const funds = yield relationships_controller_1.default.getFunds({});
        const transactions = funds.map((pair) => {
            const stocks = pair.stocks;
            const stocksPretty = pair.stocksPretty;
            return new Set(stocks
                .map((stock, index) => {
                const id = dictKeys.getID(stock);
                dictNames.set(id, stocksPretty[index]);
                return id;
            })
                .sort());
        });
        const nStocksThreshold = 60;
        const nStocksMinFrequency = 0.5;
        const aprioriData = apriori(transactions, nStocksThreshold);
        const allRules = generateAllRules(aprioriData, nStocksMinFrequency);
        yield insights_controller_1.default.refreshStocksInsights(allRules);
    });
}
function createFundsRecomendations() {
    return __awaiter(this, void 0, void 0, function* () {
        const stocks = yield relationships_controller_1.default.getStocks({});
        const transactions = stocks.map((pair) => {
            const funds = pair.funds;
            const fundsPretty = pair.fundsPretty;
            return new Set(funds
                .map((fund, index) => {
                const id = dictKeys.getID(fund);
                dictNames.set(id, fundsPretty[index]);
                return id;
            })
                .sort());
        });
        const nFundsThreshold = 79;
        const nFundsMinFrequency = 0.5;
        const aprioriData = apriori(transactions, nFundsThreshold);
        const allRules = generateAllRules(aprioriData, nFundsMinFrequency);
        yield insights_controller_1.default.refreshFundsInsights(allRules);
    });
}
function createRecomendations() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!database_service_1.collections.relationships) {
            return;
        }
        yield createStocksRecomendations();
        yield createFundsRecomendations();
    });
}
exports.createRecomendations = createRecomendations;
