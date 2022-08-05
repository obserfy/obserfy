import { render } from "../../test-utils"
import { Basic } from "./BrandBanner.stories"

describe("BrandBanner", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
