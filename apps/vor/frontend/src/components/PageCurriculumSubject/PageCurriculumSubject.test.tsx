import { render } from "../../test-utils"
import PageCurriculumSubject from "./PageCurriculumSubject"

describe("PageCurriculumSubject", () => {
  it("should render correctly", () => {
    const { container } = render(
      <PageCurriculumSubject areaId="" subjectId="" />
    )
    expect(container).toMatchSnapshot()
  })
})
