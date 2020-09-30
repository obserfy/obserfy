import React from "react"
import { render } from "../../test-utils"
import ImagePreviewOverlay from "./ImagePreviewOverlay"

describe("ImagePreviewOverlay", () => {
  it("should render correctly", () => {
    const { container } = render(
      <ImagePreviewOverlay
        imageId="asdf"
        studentId="asdfasdf"
        onDismiss={() => {}}
        src=""
      />
    )
    expect(container).toMatchSnapshot()
  })
})
