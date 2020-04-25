import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageNewSubject.stories"

describe("PageNewSubject", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
