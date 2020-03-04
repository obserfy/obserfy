import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageAllObservations.stories"

describe("PageAllObservations", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
