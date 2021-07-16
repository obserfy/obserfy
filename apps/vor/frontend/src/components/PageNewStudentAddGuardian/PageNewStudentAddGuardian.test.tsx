import { render } from "../../test-utils"
import PageNewStudentAddGuardian from "./PageNewStudentAddGuardian"

describe("PageNewStudentAddGuardian", () => {
  it("should render correctly", () => {
    const { container } = render(<PageNewStudentAddGuardian />)
    expect(container).toMatchSnapshot()
  })
})
