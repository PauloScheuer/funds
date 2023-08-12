export function calculateJaccardSimilarity(arr1: string[], arr2: string[]) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const intersectionSize = new Set([...set1].filter((elem) => set2.has(elem)))
    .size;
  const unionSize = set1.size + set2.size - intersectionSize;

  return intersectionSize / unionSize;
}
