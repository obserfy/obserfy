import { render } from "../../test-utils"
import NewGuardianForm from "./NewGuardianForm"

describe("NewGuardianForm", () => {
  it("should render correctly", () => {
    const { container } = render(
      <NewGuardianForm
        newGuardian={{
          email: "",
          name: "",
          phone: "",
          note: "",
          address: "",
        }}
        onChange={() => {}}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
