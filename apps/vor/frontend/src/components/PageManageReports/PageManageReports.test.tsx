import React from "react"
import { render } from "../../test-utils"
import PageManageReports from "./PageManageReports"

describe("PageManageReports", () => {
  it("should render correctly", () => {
    const { container } = render(<PageManageReports />)
    expect(container).toMatchSnapshot()
  })
})
