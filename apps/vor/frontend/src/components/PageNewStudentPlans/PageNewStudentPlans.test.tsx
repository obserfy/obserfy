import { render } from "../../test-utils"
import { Basic } from "./PageNewStudentPlans.stories"

describe("PageNewStudentPlans", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
