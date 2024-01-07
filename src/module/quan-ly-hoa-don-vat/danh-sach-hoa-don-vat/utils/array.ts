import * as _ from "lodash";

import { IVatInvoiceImport, VatInvoice } from "../types";

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

export const mappingVatInvoiceImport = (
  data: IVatInvoiceImport[],
): VatInvoice[] => {
  return data?.map((i) => {
    i.table = [
      ...i.table?.map((v) => ({
        ...v,
        vat_material_code: v.vat_material_id?.trim(),
        vat_material_name: v.vat_material_name?.trim(),
        quantity: v.quantity,
        unit: v.unit,
        unit_price: v.unit_price,
        total: v.total,
      })),
    ];

    return {
      vat_invoice_id: i.no?.trim(),
      serial_number: i.serial?.trim(),
      invoice_date: i.date,
      vendor_tax_code: i.seller?.taxCode?.trim(),
      vendor_name: i.seller?.companyName?.trim(),
      customer_name: i.buyer?.companyName?.trim(),
      tax_code: i.buyer?.taxCode?.trim(),
      usd_exchange_rate: i.exchange_rate,
      vat_invoice_detail: i.table || [],
      file_name: i.file_name?.trim(),
      file_path: i.path?.trim(),
    };
  });
};

export function suggestName(
  inputName: string,
  namesArray: any[],
  similarityThreshold: number,
  name: string,
) {
  let closestName = null;
  let minDistance = Infinity;

  namesArray.forEach((item) => {
    const distance = levenshteinDistance(inputName, item[name]);
    const similarity =
      1 - distance / Math.max(inputName.length, item[name].length);

    if (similarity >= similarityThreshold && distance < minDistance) {
      minDistance = distance;
      closestName = item;
    }
  });

  return closestName;
}

function levenshteinDistance(a: any = "", b: any = "") {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let matrix = [];

  // Initialize the matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Calculate the distances
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // Substitution
          matrix[i][j - 1] + 1, // Insertion
          matrix[i - 1][j] + 1, // Deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
