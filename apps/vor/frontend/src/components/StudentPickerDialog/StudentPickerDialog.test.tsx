import { render } from "../../test-utils"
import StudentPickerDialog from "./StudentPickerDialog"

describe("StudentPickerDialog", () => {
  it("should render correctly", () => {
    const { container } = render(
      <StudentPickerDialog
        filteredIds={[]}
        onDismiss={() => {}}
        onAccept={() => {}}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
