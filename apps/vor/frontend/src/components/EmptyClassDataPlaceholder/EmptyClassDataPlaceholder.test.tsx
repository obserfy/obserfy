import { render } from "../../test-utils"
import { Basic } from "./EmptyClassDataPlaceholder.stories"

describe("EmptyClassDataPlaceholder", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
