import { render } from "../../test-utils"
import { Basic } from "./PageListOfGuardians.stories"

describe("PageListOfGuardians", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
