import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./ObservationCard.stories"

describe("ObservationCard", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
