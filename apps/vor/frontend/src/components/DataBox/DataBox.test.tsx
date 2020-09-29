import React from "react"
import { render } from "../../test-utils"
import { Default } from "./DataBox.stories"

describe("DataBox", () => {
  it("should render correctly", () => {
    const { container } = render(
      <Default isEditing={false} label="" value="" />
    )
    expect(container).toMatchSnapshot()
  })
})
