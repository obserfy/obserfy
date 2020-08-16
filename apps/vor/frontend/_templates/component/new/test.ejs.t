---
to: src/components/<%= name%>/<%= name%>.test.tsx
---
import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./<%= name%>.stories"

describe("<%= name %>", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
