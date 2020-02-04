module.exports = {
  transform: {
    "^.+\\.(ts|tsx)?$": `<rootDir>/jest-preprocess.js`,
    "^.+\\.(esm.js)?$": `<rootDir>/jest-preprocess.js`,
  },
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": `identity-obj-proxy`,
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": `<rootDir>/src/__mocks__/file-mock.js`,
    ".+\\.(tsx)$": `<rootDir>/src/__mocks__/gatsby-plugin-intl3.js`,
  },
  testPathIgnorePatterns: [`node_modules`, `.cache`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby|frappe-charts)/)`],
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
  globals: {
    __PATH_PREFIX__: ``,
  },
  testURL: `http://localhost`,
  setupFiles: [`<rootDir>/loadershim.ts`, `jest-date-mock`],
  snapshotSerializers: ["jest-emotion"],
  // setupFilesAfterEnv: ["@testing-library/react/cleanup-after-each"]
}
