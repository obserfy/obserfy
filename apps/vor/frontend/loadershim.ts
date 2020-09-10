/* eslint-disable */
const { addons, mockChannel } = require("@storybook/addons")
// Required to be able to use storybook addons in jest.
//
// Jest uses components exported from storybook's CSF for testing instead of
// creating its own component. This way, tested components will always be in
// sync with the one displayed on Storybook.
addons.setChannel(mockChannel())

// recommended by gatsby
// @ts-ignore
global.___loader = {
  enqueue: jest.fn(),
}

// @ts-ignore
global.___navigate = jest.fn()

// Polyfill fetch
require("jest-fetch-mock").enableMocks()

// @ts-ignore
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    }
  }
