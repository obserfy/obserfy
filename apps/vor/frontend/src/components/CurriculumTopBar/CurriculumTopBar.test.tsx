import { render } from "../../test-utils"
import CurriculumTopBar from "./CurriculumTopBar"

describe("CurriculumTopBar", () => {
  it("should render correctly", () => {
    const { container } = render(
      <CurriculumTopBar breadcrumbs={[{ text: "Test Page" }]} />
    )
    expect(container).toMatchSnapshot()
  })
})
