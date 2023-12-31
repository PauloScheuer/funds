export default class Collection {
  private _items: Map<string, number>;
  constructor() {
    this._items = new Map();
  }

  get size() {
    return this._items.size;
  }

  add(item: string) {
    const curCount = this._items.get(item) || 0;

    this._items.set(item, curCount + 1);
  }

  getItems() {
    return Array.from(this._items.keys()).map((item) =>
      item.split("_").map((strItem) => Number(strItem))
    );
  }

  getKeys() {
    return Array.from(this._items.keys());
  }

  getFrequency(key: string) {
    return this._items.get(key) || 0;
  }

  cut(threshold: number) {
    const newItems = new Map();
    this._items.forEach((value, key) => {
      if (value >= threshold) {
        newItems.set(key, value);
      }
    });

    this._items = newItems;
  }
}
