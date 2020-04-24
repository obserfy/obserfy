import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./DatePickerDialog.stories"

describe("DatePickerDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
