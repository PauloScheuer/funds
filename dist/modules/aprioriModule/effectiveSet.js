"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EfficientSet {
    constructor(source) {
        this._source = source;
        this._items = new Array(source.size);
        source.forEach((item) => {
            this._items[item] = true;
        });
    }
    has(value) {
        return this._items[value] === true;
    }
}
exports.default = EfficientSet;
