import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageRegister.stories"

describe("PageRegister", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
