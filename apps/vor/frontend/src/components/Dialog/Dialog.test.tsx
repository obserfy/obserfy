import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Dialog.stories"

describe("Dialog", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
