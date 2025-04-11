// lint-staged.config.js (CommonJS version)
module.exports = {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"],
  };
  