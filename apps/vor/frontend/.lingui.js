module.exports = {
  locales: ["en", "id"],
  sourceLocale: "en",
  catalogs: [
    {
      path: "./src/locale/{locale}/messages",
      include: ["./src"],
    },
  ],
}
