import { render } from "../../test-utils"
import { Basic } from "./PageCurriculumArea.stories"

describe("PageCurriculumArea", () => {
  it("should render correctly", () => {
    const response: string[] = []
    fetchMock.mockResponse(JSON.stringify(response))

    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
