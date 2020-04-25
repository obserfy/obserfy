import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./GuardianRelationshipPickerDialog.stories"

describe("GuardianRelationshipPickerDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
