import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageCurriculumSettings.stories"

describe("PageCurriculumSettings", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
