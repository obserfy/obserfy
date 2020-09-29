import React from "react"
import { render } from "../../test-utils"
import { Default } from "./TopBar.stories"

describe("TopBar", () => {
  it("should render correctly", () => {
    const { container } = render(
      <Default breadcrumbs={[{ to: "/", text: "test" }]} />
    )
    expect(container).toMatchSnapshot()
  })
})
