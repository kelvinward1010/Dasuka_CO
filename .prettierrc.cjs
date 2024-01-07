module.exports = {
  plugins: [require("@trivago/prettier-plugin-sort-imports")],
  arrowParens: "always",
  printWidth: 80,
  proseWrap: "preserve",
  tabWidth: 2,
  trailingComma: "all",
  endOfLine: "auto",
  importOrder: ["^@/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
