import { render } from "../../test-utils"
import { Basic } from "./PageAddGuardian.stories"

describe("PageNewGuardian", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
