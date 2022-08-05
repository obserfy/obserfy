import { render } from "../../test-utils"
import { Basic } from "./TextArea.stories"

describe("TextArea", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
