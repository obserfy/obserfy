import { render } from "../../test-utils"
import { Basic } from "./PageEditClass.stories"

describe("PageEditClass", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
