import { render } from "../../test-utils"
import VideoPlayer from "./VideoPlayer"

describe("VideoPlayer", () => {
  it("should render correctly", () => {
    const { container } = render(<VideoPlayer src="" />)
    expect(container).toMatchSnapshot()
  })
})
