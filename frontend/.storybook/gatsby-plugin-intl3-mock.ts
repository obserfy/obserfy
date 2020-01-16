/* eslint-disable */
// @ts-nocheck
// Mock gatsby pl

const React = require("react")
const plugin = require("react-intl")
const gatsby = require("gatsby")

module.exports = {
  ...plugin,
  navigate: gatsby.navigate,
  Link: ({
    activeClassName,
    activeStyle,
    getProps,
    innerRef,
    partiallyActive,
    ref,
    replace,
    to,
    ...rest
  }) =>
    React.createElement("a", {
      ...rest,
      href: to,
    }),
}
