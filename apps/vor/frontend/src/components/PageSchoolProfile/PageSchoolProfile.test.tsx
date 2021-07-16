import { render } from "../../test-utils"
import PageSchoolProfile from "./PageSchoolProfile"

describe("PageSchoolProfile", () => {
  it("should render correctly", () => {
    const { container } = render(<PageSchoolProfile />)
    expect(container).toMatchSnapshot()
  })
})
