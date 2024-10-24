import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["controllers/**/*.js", "models/**/*.js", "routes/**/*.js", "scripts/**/*.js", "index.js", "utils/**/*.js", "config/**/*.js", "middleware/**/*.js"],
    languageOptions: {
      sourceType: "commonjs", // Use CommonJS for backend
      ecmaVersion: 2020,
      globals: {
        ...globals.node, // Include Node.js globals like `process`, `require`, `module`, `console`
      },
    },
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-undef": "error",
    },
  },
  pluginJs.configs.recommended,
];
