import { create } from "@storybook/theming"
import { addons } from "@storybook/addons"

const theme = create({
  base: "dark",
  appBg: "#1d1d1d",
  barBg: "#222222",
  brandUrl: "https://obserfy.com",
  brandName: "Obserfy",
})
addons.setConfig({ theme })