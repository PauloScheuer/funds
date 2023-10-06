"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Collection {
    constructor() {
        this._items = new Map();
    }
    get size() {
        return this._items.size;
    }
    add(item) {
        const curCount = this._items.get(item) || 0;
        this._items.set(item, curCount + 1);
    }
    getItems() {
        return Array.from(this._items.keys()).map((item) => item.split("_").map((strItem) => Number(strItem)));
    }
    getKeys() {
        return Array.from(this._items.keys());
    }
    getFrequency(key) {
        return this._items.get(key) || 0;
    }
    cut(threshold) {
        const newItems = new Map();
        this._items.forEach((value, key) => {
            if (value >= threshold) {
                newItems.set(key, value);
            }
        });
        this._items = newItems;
    }
}
exports.default = Collection;
