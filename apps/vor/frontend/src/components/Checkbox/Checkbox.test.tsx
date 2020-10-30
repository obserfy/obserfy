import React from "react"
import { render } from "../../test-utils"
import Checkbox from "./Checkbox"

describe("Checkbox", () => {
  it("should render correctly", () => {
    const { container } = render(<Checkbox label="just at test" />)
    expect(container).toMatchSnapshot()
  })
})
