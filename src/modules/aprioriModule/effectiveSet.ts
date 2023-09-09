export default class EfficientSet {
  private _items: boolean[];
  private _source: Set<number>;

  constructor(source: Set<number>) {
    this._source = source;

    this._items = new Array(source.size);
    source.forEach((item) => {
      this._items[item] = true;
    });
  }

  has(value: number) {
    return this._items[value] === true;
  }
}
