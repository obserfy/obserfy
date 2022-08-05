import { render } from "../../test-utils"
import CurriculumListLoadingPlaceholder from "./CurriculumListLoadingPlaceholder"

describe("CurriculumListLoadingPlaceholder", () => {
  it("should render correctly", () => {
    const { container } = render(<CurriculumListLoadingPlaceholder />)
    expect(container).toMatchSnapshot()
  })
})
