export const checkQuantityCO = (item: any) => {
  return item?.co_used === item?.quantity;
};

export const checkAvailableCOInVAT = (item: any) => {
  return typeof item?.co_available === "number" ? item.co_available > 0 : true;
};
