import relationshipsManager from "../managers/relationships.manager";
import { collections } from "../services/database.service";

let totalGenTime = 0;
let totalCutTime = 0;
let totalCheckTime = 0;

class Collection {
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
    return Array.from(this._items.keys())
      .sort()
      .map((item) => item.split("_").map((value) => Number(value)));
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

class TwoWayMap {
  private _mapIDToValue: Map<string, string>;
  private _mapValueToID: Map<string, string>;
  private _nCurID: number;
  constructor() {
    this._mapIDToValue = new Map<string, string>();
    this._mapValueToID = new Map<string, string>();
    this._nCurID = 0;
  }

  getValue(id: string) {
    return this._mapIDToValue.get(id);
  }

  getID(value: string) {
    if (!this._mapValueToID.has(value)) {
      this._mapValueToID.set(value, `${this._nCurID}`);
      this._mapIDToValue.set(`${this._nCurID}`, value);
      this._nCurID++;
    }
    return this._mapValueToID.get(value) || "0";
  }
}

const dict = new TwoWayMap();

function printCollections(collections: Collection[]) {
  collections.forEach((collection, i) => {
    console.log(i);
    const items = collection.getItems();
    items.forEach((item, i) => {
      console.log(
        " item",
        i,
        item.map((id) => dict.getValue(`${id}`)).join(" ")
      );
    });
  });
}

function apriori(items: Set<string>[], threshold: number) {
  let levelZeroCollection = new Collection();
  items.forEach((transaction) => {
    transaction.forEach((value) => {
      levelZeroCollection.add(value);
    });
  });
  levelZeroCollection.cut(threshold);

  const collections = [levelZeroCollection];

  let k = 1;
  while (collections[k - 1].size > 0) {
    const lastCollection = collections[k - 1];
    const kCollection = new Collection();

    const candidates = generateCandidates(lastCollection);
    const start = Date.now();
    candidates.forEach((candidate) => {
      const candidateKey = candidate.join("_");
      items.forEach((transaction) => {
        const bIsCandidateInTransaction = candidate.every((element) => {
          return transaction.has(element);
        });
        if (bIsCandidateInTransaction) {
          kCollection.add(candidateKey);
        }
      });
    });
    totalCheckTime += Date.now() - start;

    kCollection.cut(threshold);
    collections.push(kCollection);
    k++;
  }

  // printCollections(collections);
}
let a = 0;
let b = 0;
let c = 0;
function generateCandidates(lastCollection: Collection) {
  const start = Date.now();
  const start2 = Date.now();
  const candidates = [] as number[][];
  const items = lastCollection.getItems();
  totalCutTime += Date.now() - start2;
  for (let i = 0; i < items.length; i++) {
    c++;
    const item1 = items[i];
    for (let j = i + 1; j < items.length; j++) {
      const item2 = items[j];
      b++;
      let canBeCombined = true;
      const limit = item1.length - 1;
      for (let k = 0; k < limit; k++) {
        a++;
        if (item1[k] !== item2[k]) {
          canBeCombined = false;
          break;
        }
      }

      if (canBeCombined) {
        candidates.push([...item1, item2[item2.length - 1]]);
      }
    }
  }
  totalGenTime += Date.now() - start;
  return candidates.map((candidate) => candidate.map((value) => `${value}`));
}

export async function createRecomendations() {
  if (!collections.relationships) {
    console.log("no relationships");
    return;
  }

  const threshold = 57;
  const funds = await relationshipsManager.getFunds({});
  const stocks = funds.map((pair) => {
    const stocks = (pair.stocks as string[]).sort();
    return new Set<string>(stocks.map((stock) => dict.getID(stock)));
  });
  // const stocks = [
  //   new Set(
  //     ["PETR4", "CGRA4", "BBAS3", "ODPV3"].map((stock) => dict.getID(stock))
  //   ),
  //   new Set(["PETR4", "CGRA4", "ODPV3"].map((stock) => dict.getID(stock))),
  //   new Set(["PETR4", "CGRA4"].map((stock) => dict.getID(stock))),
  //   new Set(["CGRA4", "BBAS3", "ODPV3"].map((stock) => dict.getID(stock))),
  //   new Set(["CGRA4", "BBAS3"].map((stock) => dict.getID(stock))),
  //   new Set(["BBAS3", "ODPV3"].map((stock) => dict.getID(stock))),
  //   new Set(["CGRA4", "ODPV3"].map((stock) => dict.getID(stock))),
  // ];

  console.time("apriori");
  apriori(stocks, threshold);
  console.timeEnd("apriori");
  console.log("gen:", totalGenTime);
  console.log("check:", totalCheckTime);
  console.log("cut:", totalCutTime);
  console.log(a);
  console.log(b);
  console.log(c);
}
