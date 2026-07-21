import coreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...coreWebVitals,
  {
    ignores: [".next/**", "node_modules/**", ".playwright-cli/**"],
  },
  {
    // React-compiler-era rules flag patterns this codebase uses deliberately:
    // setMounted hydration guards, react-three-fiber useFrame mutations, and
    // decorative inline components. Kept visible as warnings, not errors.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/static-components": "warn",
    },
  },
];

export default eslintConfig;
