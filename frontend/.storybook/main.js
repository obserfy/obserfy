module.exports = {
  stories: ["../src/**/*stories.tsx"],
  addons: [
    'storybook-addon-deps/preset-explorer',
    "@storybook/addon-actions",
    "@storybook/addon-links",
    "@storybook/addon-knobs",
    "@storybook/addon-a11y",
    "storybook-addon-i18n",
    "@storybook/addon-viewport",
    "@storybook/addon-docs",
  ],
}
