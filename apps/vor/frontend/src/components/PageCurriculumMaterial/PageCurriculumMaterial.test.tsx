import { render } from "../../test-utils"
import PageCurriculumMaterial from "./PageCurriculumMaterial"

describe("PageCurriculumMaterial", () => {
  it("should render correctly", () => {
    const { container } = render(
      <PageCurriculumMaterial areaId="" materialId="" subjectId="" />
    )
    expect(container).toMatchSnapshot()
  })
})
