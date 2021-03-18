module.exports = {
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleNameMapper: {
    "^@components(.*)$": "<rootDir>/components$1",
    "^@pages(.*)$": "<rootDir>/pages$1",
    "^@hooks(.*)$": "<rootDir>/hooks$1",
  },
  transform: {
    // This is the default, but just a reminder that if you add transforms it
    // must be explicit here
    "^.+\\.[t|j]sx?$": "babel-jest"
  }
};
