import { advanceTo } from "jest-date-mock"

import { render } from "../../test-utils"
import PageNewReport from "./PageNewReport"

describe("PageNewReport", () => {
  it("should render correctly", () => {
    advanceTo(new Date(2018, 5, 27, 0, 0, 0)) // r

    const { container } = render(<PageNewReport />)
    expect(container).toMatchSnapshot()
  })
})
