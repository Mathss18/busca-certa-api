import { get as getLevensthein } from 'fast-levenshtein';

/*
 * Sort an array of objects based on the Levenshtein distance between a term and a key of the object
 * @param array Array of objects to be sorted
 * @param term Term to be compared
 * @param key Key of the object to be compared
 * @returns Sorted array
 */
function sortLevensthein(array: Array<unknown>, term: string, key: string) {
  return array.sort((a, b) => {
    const distanceA = getLevensthein(term, a[key]);
    const distanceB = getLevensthein(term, b[key]);
    return distanceA - distanceB;
  });
}

export { sortLevensthein };
