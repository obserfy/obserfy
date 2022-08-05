import { render } from "../../test-utils"
import { Basic } from "./PageAdmin.stories"

describe("PageAdmin", () => {
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
