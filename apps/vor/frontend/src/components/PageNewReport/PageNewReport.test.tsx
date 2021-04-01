import React from "react"
import { render } from "../../test-utils"
import PageNewReport from "./PageNewReport"

describe("PageNewReport", () => {
  it("should render correctly", () => {
    const { container } = render(<PageNewReport />)
    expect(container).toMatchSnapshot()
  })
})
