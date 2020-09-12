import React from "react"
import { advanceTo } from "jest-date-mock"
import { render } from "../../test-utils"
import { Basic } from "./PageNewObservation.stories"

describe("PageNewObservation", () => {
  it("should render correctly", () => {
    advanceTo(new Date(2018, 5, 27, 0, 0, 0)) // r

    const response: string[] = []
    fetchMock.mockResponse(JSON.stringify(response))
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
