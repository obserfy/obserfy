import dayjs from "../../dayjs"
import { render } from "../../test-utils"
import EditReportSideBar from "./EditReportSideBar"

describe("EditReportSideBar", () => {
  it("should render correctly", () => {
    const { container } = render(
      <EditReportSideBar
        periodStart={dayjs()}
        periodEnd={dayjs()}
        title="The end is nigh"
        onClose={() => {}}
        open
        reportId="asdfasdfa"
      />
    )
    expect(container).toMatchSnapshot()
  })
})
