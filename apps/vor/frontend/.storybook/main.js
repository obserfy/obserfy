module.exports = {
  stories: ["../src/**/*stories.tsx"],
  presets: ['storybook-addon-deps/preset-explorer'],
  addons: [
    '@storybook/addon-storysource',
    "@storybook/addon-actions",
    "@storybook/addon-links",
    "@storybook/addon-knobs",
    "@storybook/addon-a11y",
    "storybook-addon-i18n",
    "@storybook/addon-viewport",
    "@storybook/addon-docs",
  ],
}
