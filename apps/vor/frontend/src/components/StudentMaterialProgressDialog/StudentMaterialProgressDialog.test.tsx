import { render } from "../../test-utils"
import { Basic } from "./StudentMaterialProgressDialog.stories"

describe("StudentMaterialProgressDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
