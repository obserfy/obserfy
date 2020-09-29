---
to: src/components/<%= name%>/<%= name%>.test.tsx
---
import React from "react"
import { render } from "../../test-utils"
import <%= name %> from "./<%= name %>"

describe("<%= name %>", () => {
  it("should render correctly", () => {
    const { container } = render(<<%= name%> />)
    expect(container).toMatchSnapshot()
  })
})
