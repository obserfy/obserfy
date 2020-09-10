import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./StudentsList.stories"

describe("StudentsList", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
