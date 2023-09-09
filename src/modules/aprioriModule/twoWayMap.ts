export default class TwoWayMap {
  private _mapIDToValue: Map<number, string>;
  private _mapValueToID: Map<string, number>;
  private _nCurID: number;
  constructor() {
    this._mapIDToValue = new Map<number, string>();
    this._mapValueToID = new Map<string, number>();
    this._nCurID = 0;
  }

  getValue(id: number) {
    return this._mapIDToValue.get(id) || "";
  }

  getID(value: string) {
    if (!this._mapValueToID.has(value)) {
      this._mapValueToID.set(value, this._nCurID);
      this._mapIDToValue.set(this._nCurID, value);
      this._nCurID++;
    }
    return this._mapValueToID.get(value) || 0;
  }
}
