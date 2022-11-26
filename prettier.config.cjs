/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  arrowParens: "always",
  printWidth: 120,
  singleQuote: false,
  jsxSingleQuote: false,
  semi: true,
  trailingComma: "all",
  tabWidth: 2,
  useTabs: false,
  quoteProps: "consistent",
  bracketSpacing: true,
  bracketSameLine: false,
  proseWrap: "preserve",
};
