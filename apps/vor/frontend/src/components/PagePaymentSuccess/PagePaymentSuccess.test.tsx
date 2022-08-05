import { render } from "../../test-utils"
import PagePaymentSuccess from "./PagePaymentSuccess"

describe("PagePaymentSuccess", () => {
  it("should render correctly", () => {
    const { container } = render(<PagePaymentSuccess />)
    expect(container).toMatchSnapshot()
  })
})
