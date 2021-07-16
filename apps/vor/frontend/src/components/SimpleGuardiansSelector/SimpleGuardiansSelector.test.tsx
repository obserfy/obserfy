import { render } from "../../test-utils"
import SimpleGuardiansSelector from "./SimpleGuardiansSelector"

describe("SimpleGuardiansSelector", () => {
  it("should render correctly", () => {
    const { container } = render(
      <SimpleGuardiansSelector
        onChange={() => {}}
        selectedId=""
        currentGuardianIds={[]}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
