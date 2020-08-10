import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageGallery.stories"

describe("PageGallery", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
