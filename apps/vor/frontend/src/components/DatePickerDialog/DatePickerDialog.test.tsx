import React from "react"
import { render } from "../../test-utils"
import { Default } from "./DatePickerDialog.stories"

describe("DatePickerDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<Default />)
    expect(container).toMatchSnapshot()
  })
})
