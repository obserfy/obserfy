import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageCurriculumArea.stories"

describe("PageCurriculumArea", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
