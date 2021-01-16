import React from "react"
import { render } from "../../test-utils"
import VideoPlayerDialog from "./VideoPlayerDialog"

describe("VideoPlayerDialog", () => {
  it("should render correctly", () => {
    const { container } = render(
      <VideoPlayerDialog onClose={() => {}} src="" studentId="" />
    )
    expect(container).toMatchSnapshot()
  })
})
