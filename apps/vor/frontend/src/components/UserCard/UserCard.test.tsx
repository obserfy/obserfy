import { render } from "../../test-utils"
import { Basic } from "./UserCard.stories"

describe("UserCard", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
