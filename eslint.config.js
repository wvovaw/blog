import antfu from "@antfu/eslint-config";

export default antfu({
  formatters: true,
  stylistic: {
    indent: 2,
    quotes: "double",
    semi: true,
  },
  astro: {
    overrides: {
    },
  },
  vue: {
    overrides: {
    },
  },
  javascript: {
    overrides: {
    },
  },
});
