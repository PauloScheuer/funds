"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TwoWayMap {
    constructor() {
        this._mapIDToValue = new Map();
        this._mapValueToID = new Map();
        this._nCurID = 0;
    }
    getValue(id) {
        return this._mapIDToValue.get(id) || "";
    }
    getID(value) {
        if (!this._mapValueToID.has(value)) {
            this._mapValueToID.set(value, this._nCurID);
            this._mapIDToValue.set(this._nCurID, value);
            this._nCurID++;
        }
        return this._mapValueToID.get(value) || 0;
    }
}
exports.default = TwoWayMap;
