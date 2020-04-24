import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageCurriculumSettings.stories"

describe("PageCurriculumSettings", () => {
  it("should render correctly", () => {
    // TODO: This is a temporary fix, make sure to test mock response correctly.
    const response = [
      {
        name: "test",
      },
    ]
    fetchMock.mockResponse(JSON.stringify(response))
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
