import React from "react"
import { render } from "../../test-utils"
import StudentPickerDialog from "./StudentPickerDialog"

describe("StudentPickerDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<StudentPickerDialog />)
    expect(container).toMatchSnapshot()
  })
})
