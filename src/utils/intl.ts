export const intlUSD = new Intl.NumberFormat("en-US", {
  style: "decimal",
  currency: "USD",
});

export const decimalUSD = new Intl.NumberFormat("en-US", {
  style: "decimal",
  currency: "USD",
  minimumFractionDigits: 6,
});

export const decimalUSD4Number = new Intl.NumberFormat("en-US", {
  style: "decimal",
  currency: "USD",
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

export const decimalUSD2Number = new Intl.NumberFormat("en-US", {
  style: "decimal",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
