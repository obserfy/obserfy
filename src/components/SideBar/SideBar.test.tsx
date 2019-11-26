import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./SideBar.stories"

describe("SideBar", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
