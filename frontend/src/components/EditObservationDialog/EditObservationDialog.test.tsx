import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./EditObservationDialog.stories"

describe("EditObservationDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
