import { render } from "../../test-utils"
import StudentsInReport from "./StudentsInReport"

describe("PageManageReports", () => {
  it("should render correctly", () => {
    const { container } = render(<StudentsInReport reportId="" studentId="" />)
    expect(container).toMatchSnapshot()
  })
})
