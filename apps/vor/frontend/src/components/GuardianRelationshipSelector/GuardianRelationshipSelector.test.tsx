import { GuardianRelationship } from "../../hooks/api/students/usePostNewStudent"
import { render } from "../../test-utils"
import GuardianRelationshipSelector from "./GuardianRelationshipSelector"

describe("GuardianRelationshipSelector", () => {
  it("should render correctly", () => {
    const { container } = render(
      <GuardianRelationshipSelector
        onChange={() => {}}
        value={GuardianRelationship.Mother}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
