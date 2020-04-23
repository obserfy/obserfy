import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./DeleteObservationDialog.stories"

describe("DeleteObservationDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
