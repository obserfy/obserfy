import React from "react"
import { render } from "../../test-utils"
import PageCurriculumMaterial from "./PageCurriculumMaterial"

describe("PageCurriculumMaterial", () => {
  it("should render correctly", () => {
    const { container } = render(<PageCurriculumMaterial />)
    expect(container).toMatchSnapshot()
  })
})
