import React from "react"
import { render } from "../../test-utils"
import PageSubject from "./PageSubject"

describe("PageSubject", () => {
  it("should render correctly", () => {
    const { container } = render(<PageSubject />)
    expect(container).toMatchSnapshot()
  })
})
