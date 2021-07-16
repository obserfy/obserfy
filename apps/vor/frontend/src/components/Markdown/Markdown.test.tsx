import { render } from "../../test-utils"
import Markdown from "./Markdown"

describe("Markdown", () => {
  it("should render correctly", () => {
    const { container } = render(<Markdown markdown="# testing" />)
    expect(container).toMatchSnapshot()
  })
})
