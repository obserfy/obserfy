import { advanceTo } from "jest-date-mock"

import { render } from "../../test-utils"
import ObservationListItem from "./ObservationListItem"

describe("ObservationListItem", () => {
  it("should render correctly", () => {
    advanceTo(new Date("2019-12-11T11:53:02.050339Z"))
    const { container } = render(
      <ObservationListItem
        observation={{
          visibleToGuardians: false,
          studentName: "Angelica",
          createdDate: "2019-12-10T11:53:02.050339Z",
          id: "",
          longDesc: "",
          categoryId: "0",
          shortDesc: "",
          images: [],
        }}
        detailsUrl=""
        studentId=""
      />
    )
    expect(container).toMatchSnapshot()
  })
})
