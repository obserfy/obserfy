import { render } from "../../test-utils"
import { Basic } from "./Layout.stories"

describe("Layout", () => {
  it("should render correctly", () => {
    // TODO: This is a temporary fix, make sure to test mock response correctly.
    const response = {
      name: "Loco",
    }
    fetchMock.mockResponse(JSON.stringify(response))
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
