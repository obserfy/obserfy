import React from "react"
import { render } from "../../test-utils"
import { Default } from "./PageObservationDetails.stories"

describe("PageObservationDetails", () => {
  it("should render correctly", () => {
    const { container } = render(<Default />)
    expect(container).toMatchSnapshot()
  })
})
