// import fs from "fs";

// const N_CNPJ = 1;
// const N_TYPE = 4;
// const N_ASSET = 16;

// const STR_STOCKS = "Ações";

// //Read a file and return an array of pairs containing a fund and a stock
// function getPairs(filename) {
//   const data = fs.readFileSync(filename, { encoding: "latin1" }).split(/\r?\n/);

//   const pairs = [];
//   data.forEach((entry) => {
//     const entryData = entry.split(";");
//     const cnpj = entryData[N_CNPJ];
//     const type = entryData[N_TYPE];
//     const asset = entryData[N_ASSET];
//     if (type !== STR_STOCKS) {
//       return;
//     }

//     pairs.push({
//       fund: cnpj,
//       stock: asset,
//     });
//   });

//   return pairs;
// }

// //Receives a list of stocks and returns all the possible combinations giving a certain size
// function generateCombinations(stocks, size) {
//   const combinations = [];
//   const currentCombination = [];
//   generateCombinationsRec(combinations, currentCombination, stocks, size, 0, 0);

//   return combinations;
// }

// //Aux to generateCombinations
// function generateCombinationsRec(
//   combinations,
//   currentCombination,
//   stocks,
//   size,
//   currentIndex,
//   currentStart
// ) {
//   if (currentIndex === size) {
//     combinations.push([...currentCombination]);
//     return;
//   }
//   for (let i = currentStart; i < stocks.length; i++) {
//     currentCombination[currentIndex] = stocks[i];
//     generateCombinationsRec(
//       combinations,
//       currentCombination,
//       stocks,
//       size,
//       currentIndex + 1,
//       i + 1
//     );
//   }
// }

// function getFrequencies(pairs) {
//   const frequencies = new Map();

//   pairs.forEach((pair) => {
//     const curFrequency = frequencies.get(pair.stock) || 0;
//     frequencies.set(pair.stock, curFrequency + 1);
//   });

//   return frequencies;
// }

// function getFundsAndStocks(pairs) {
//   const funds = new Map();
//   const stocks = new Set();
//   pairs.forEach((pair) => {
//     const curComposition = funds.get(pair.fund) || [];
//     funds.set(pair.fund, [...curComposition, pair.stock]);

//     stocks.add(pair.stock);
//   });

//   return [funds, Array.from(stocks)];
// }

// function apriori(funds, stocks, frequencies, threshold, minFrequency) {
//   const curSize = 2;

//   const combinations = generateCombinations(stocks, curSize);

//   while (true) {
//     if (combinations.length) {
//       return;
//     }
//   }
// }

// function main() {
//   const threshold = 5;
//   const minFrequency = 0.2;
//   const pairs = getPairs("composition.csv");
//   const frequencies = getFrequencies(pairs);

//   const filteredPairs = pairs.filter((pair) => {
//     return frequencies.get(pair.stock) >= threshold;
//   });

//   const [funds, stocks] = getFundsAndStocks(filteredPairs);

//   apriori(funds, stocks, frequencies, threshold, minFrequency);
// }
// main();
