import relationshipsManager from "../../managers/relationships.manager";
import { collections } from "../../services/database.service";
import TwoWayMap from "./twoWayMap";
import EfficientSet from "./effectiveSet";
import Collection from "./collection";

type Rule = {
  first: number[];
  second: number[];
  frequency: number;
};

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

function printRules(rules: Rule[]) {
  rules.forEach((rule) => {
    const firstValues = rule.first.map((id) => dict.getValue(id));
    const secondValues = rule.second.map((id) => dict.getValue(id));
    console.log(firstValues, secondValues, rule.frequency);
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

  return collections.splice(0, collections.length - 1);
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

function generateRulesForItem(
  allRules: Rule[],
  minFrequency: number,
  elements: number[],
  originalPartOne: number[],
  collections: Collection[],
  originalFrequency: number,
  level: number,
  startK: number,
  stopLevel: number
) {
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

    const partOneFrequency =
      originalFrequency /
      collections[partOne.length - 1].getFrequency(partOneKey);

    const partTwoFrequency =
      originalFrequency / collections[level - 1].getFrequency(partTwoKey);

    if (partOneFrequency >= minFrequency) {
      allRules.push({
        first: partOne,
        second: partTwo,
        frequency: partOneFrequency,
      });
    }
    if (partTwoFrequency >= 0.5) {
      allRules.push({
        first: partTwo,
        second: partOne,
        frequency: partTwoFrequency,
      });
    }
    generateRulesForItem(
      allRules,
      minFrequency,
      partTwo,
      partOne,
      collections,
      originalFrequency,
      level - 1,
      k,
      stopLevel
    );
    if (stopLevel === 1) {
      break;
    }
  }
}

function generateAllRules(collections: Collection[], minFrequency: number) {
  const allRules: Rule[] = [];
  for (let i = 1; i < collections.length; i++) {
    const collection = collections[i];
    const items = collection.getItems();
    const keys = collection.getKeys();
    for (let j = 0; j < items.length; j++) {
      const key = keys[j];
      const elements = items[j];
      const thisFrequency = collection.getFrequency(key);
      const nStopLevel = Math.ceil(elements.length / 2);
      generateRulesForItem(
        allRules,
        minFrequency,
        elements,
        [],
        collections,
        thisFrequency,
        i,
        0,
        nStopLevel
      );
    }
  }
  return allRules;
}

async function createStocksRecomendations() {
  const funds = await relationshipsManager.getFunds({});
  const transactions = funds.map((pair) => {
    const stocks = pair.stocks as string[];
    return new Set<number>(stocks.map((stock) => dict.getID(stock)).sort());
  });

  const nStocksThreshold = 60;
  const nStocksMinFrequency = 0.5;

  const aprioriData = apriori(transactions, nStocksThreshold);
  const allRules = generateAllRules(aprioriData, nStocksMinFrequency);
  return allRules;
}

async function createFundsRecomendations() {
  const stocks = await relationshipsManager.getStocks({});
  const transactions = stocks.map((pair) => {
    const funds = pair.funds as string[];
    return new Set<number>(funds.map((fund) => dict.getID(fund)).sort());
  });

  const nFundsThreshold = 78;
  const nFundsMinFrequency = 0.5;

  const aprioriData = apriori(transactions, nFundsThreshold);
  const allRules = generateAllRules(aprioriData, nFundsMinFrequency);
  return allRules;
}

export async function createRecomendations() {
  if (!collections.relationships) {
    return;
  }
  await createStocksRecomendations();
  await createFundsRecomendations();
}
