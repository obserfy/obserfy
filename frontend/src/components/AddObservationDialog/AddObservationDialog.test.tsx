import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./AddObservationDialog.stories"

describe("AddObservationDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
