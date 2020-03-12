import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageEditSubject.stories"

describe("PageEditSubject", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
