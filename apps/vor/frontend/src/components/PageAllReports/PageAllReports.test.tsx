import { render } from "../../test-utils"
import PageAllReports from "./PageAllReports"

describe("PageAllReports", () => {
  it("should render correctly", () => {
    const { container } = render(<PageAllReports />)
    expect(container).toMatchSnapshot()
  })
})
