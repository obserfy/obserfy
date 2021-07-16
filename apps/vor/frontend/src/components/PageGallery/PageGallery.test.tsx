import { render } from "../../test-utils"
import PageGallery from "./PageGallery"

describe("PageGallery", () => {
  it("should render correctly", () => {
    const { container } = render(<PageGallery studentId="asdfasd" />)
    expect(container).toMatchSnapshot()
  })
})
