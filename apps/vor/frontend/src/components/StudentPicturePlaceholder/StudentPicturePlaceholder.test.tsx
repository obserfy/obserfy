import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./StudentPicturePlaceholder.stories"

describe("StudentPicturePlaceholder", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
