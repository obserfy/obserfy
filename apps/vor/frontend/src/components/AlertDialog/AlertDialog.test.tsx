import { render } from "../../test-utils"
import { Basic } from "./AlertDialog.stories"

describe("AlertDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
