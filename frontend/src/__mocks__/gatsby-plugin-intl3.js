/* eslint-disable */
const React = require("react")
const plugin = jest.requireActual("gatsby-plugin-intl3")

module.exports = {
  ...plugin,
  Link: jest.fn().mockImplementation(
    // these props are invalid for an `a` tag
    ({
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
        href: to
      })
  ),
}
