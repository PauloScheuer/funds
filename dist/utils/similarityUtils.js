"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateJaccardSimilarity = void 0;
function calculateJaccardSimilarity(arr1, arr2) {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    const intersectionSize = new Set([...set1].filter((elem) => set2.has(elem)))
        .size;
    const unionSize = set1.size + set2.size - intersectionSize;
    return intersectionSize / unionSize;
}
exports.calculateJaccardSimilarity = calculateJaccardSimilarity;
