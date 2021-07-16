import { render } from "../../test-utils"
import Chatwoot from "./Chatwoot"

describe("Chatwoot", () => {
  it("should render correctly", () => {
    const { container } = render(<Chatwoot />)
    expect(container).toMatchSnapshot()
  })
})
