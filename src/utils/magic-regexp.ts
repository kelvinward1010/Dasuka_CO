export function containsOnlyNumbers(str: string): boolean {
  return /^\d+$/.test(str) || str === "";
}

export function containsOnlyNumbersAndDotAndComma(str: string): boolean {
  return /^[-\d,.]+$/.test(str);
}
