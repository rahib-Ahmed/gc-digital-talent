module.exports = {
  root: true,
  extends: ["custom"],
  plugins: ["formatjs"],
  rules: {
    // this package does not have a translation script
    "formatjs/blocklist-elements": ["error", ["literal"]],
  },
};
