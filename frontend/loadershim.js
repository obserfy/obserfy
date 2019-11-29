/* eslint-disable */
const { addons, mockChannel } =  require("@storybook/addons")

// Required to be able to use storybook addons in jest.
//
// Jest uses components exported from storybook's CSF for testing instead of
// creating its own component. This way, tested  components will always be in
// sync with the one displayed on Storybook.
addons.setChannel(mockChannel())

// recommended by gatsby
global.___loader = {
  enqueue: jest.fn()
}
