import coreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...coreWebVitals,
  {
    ignores: [".next/**", "node_modules/**", ".playwright-cli/**"],
  },
];

export default eslintConfig;
