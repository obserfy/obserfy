import { render } from "../../test-utils"
import { Basic } from "./PageForgotPassword.stories"

describe("PageForgotPassword", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
