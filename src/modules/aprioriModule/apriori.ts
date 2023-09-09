import relationshipsManager from "../../managers/relationships.manager";
import { collections } from "../../services/database.service";
import TwoWayMap from "./twoWayMap";
import EfficientSet from "./effectiveSet";
import Collection from "./collection";

const dict = new TwoWayMap();

function printCollections(collections: Collection[]) {
  collections.forEach((collection, i) => {
    console.log(i);
    const items = collection.getItems();
    items.forEach((item, i) => {
      console.log(" item", i, item.map((id) => dict.getValue(id)).join(" "));
    });
  });
}

function apriori(items: Set<number>[], threshold: number) {
  let levelZeroCollection = new Collection();
  items.forEach((transaction) => {
    transaction.forEach((value) => {
      levelZeroCollection.add(`${value}`);
    });
  });
  levelZeroCollection.cut(threshold);

  const collections = [levelZeroCollection];
  let filteredItems = items.map((item) => {
    return new EfficientSet(item);
  });

  let k = 1;
  while (collections[k - 1].size > 0) {
    const lastCollection = collections[k - 1];
    const kCollection = new Collection();

    const candidates = generateCandidates(lastCollection);

    const foundedIndexes: Set<number> = new Set();

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

    const newFilteredItems: EfficientSet[] = [];
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

  return collections;
}

function generateCandidates(lastCollection: Collection) {
  const candidates = [] as number[][];
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
      } else {
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

async function createStocksRecomendations() {
  const funds = await relationshipsManager.getFunds({});
  const transactions = funds.map((pair) => {
    const stocks = (pair.stocks as string[]).sort();
    return new Set<number>(stocks.map((stock) => dict.getID(stock)));
  });

  const nStocksThreshold = 60;
  return apriori(transactions, nStocksThreshold);
}

async function createFundsRecomendations() {
  const stocks = await relationshipsManager.getStocks({});
  const funds = stocks.map((pair) => {
    const funds = (pair.funds as string[]).sort();
    return new Set<number>(funds.map((fund) => dict.getID(fund)));
  });

  const nFundsThreshold = 75;
  return apriori(funds, nFundsThreshold);
}

export async function createRecomendations() {
  if (!collections.relationships) {
    return;
  }

  createStocksRecomendations();
  createFundsRecomendations();
}
