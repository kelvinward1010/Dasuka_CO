import * as _ from "lodash";

// find each element on original array and updatedArray.
// if element is not found on updatedArray, add status: 'remove'.
// if element is not found on original array, add status: 'create'.
// original [{a: 1, b: 2}, {a: 3, b: 4}] + newArray [{a: 1, b: 3}, {a: 5, b: 6}]
// result   [{a: 3, b: 4, status: 'remove'}, {a: 5, b: 6, status:'create'}]
export const getUpdatedArray = (
  originalArray: any[],
  updatedArray: any[],
  unionKey: string,
) => {
  // get difference between originalArray and updatedArray
  const difference = _.differenceBy(originalArray, updatedArray, unionKey);
  // get intersection between originalArray and updatedArray
  const intersection = _.intersectionBy(originalArray, updatedArray, unionKey);
  // get difference between updatedArray and originalArray
  const difference2 = _.differenceBy(updatedArray, originalArray, unionKey);

  // add status: 'remove' for each element in difference
  const result = difference.map((element) => {
    return { ...element, status: "3" };
  });

  // add status: 'create' for each element in difference2
  difference2.forEach((element) => {
    result.push({ ...element, status: "1" });
  });

  // find each element in intersection and updatedArray
  // if element is not updated, add status: 'update'
  intersection.forEach((element) => {
    const index = _.findIndex(updatedArray, [unionKey, element[unionKey]]);
    if (!_.isEqual(element, updatedArray[index])) {
      result.push({ ...updatedArray[index], status: "2" });
    }
  });

  // return result
  return result;
};
