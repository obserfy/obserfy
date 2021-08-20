import { render } from "../../test-utils"
import RadioGroup from "./RadioGroup"

describe("RadioGroups", () => {
  it("should render correctly", () => {
    const { container } = render(
      <RadioGroup
        name="Included students"
        value={0}
        onChange={() => {}}
        options={[
          {
            label: `All Student`,
            description: `Include all students into this report.`,
          },
          {
            label: `Custom`,
            description: `Select students to be included manually.`,
          },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
