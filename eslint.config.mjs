import { defineConfig } from "eslint/config";
import next from "eslint-config-next/core-web-vitals";
import ts from "eslint-config-next/typescript";
// Native links deliberately exercise the static host and avoid prefetching heavy project galleries.
export default defineConfig([
  ...next,
  ...ts,
  {
    rules: {
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);
