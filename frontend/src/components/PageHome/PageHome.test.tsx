import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageHome.stories"

describe("PageHome", () => {
  it("should render correctly", () => {
    // TODO: This is a temporary fix, make sure to test mock response correctly.
    const response: string[] = []
    fetchMock.mockResponse(JSON.stringify(response))

    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
