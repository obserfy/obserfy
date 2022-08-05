import { advanceTo } from "jest-date-mock"

import dayjs from "../../dayjs"
import { render } from "../../test-utils"
import VideoPlayerDialog from "./VideoPlayerDialog"

describe("VideoPlayerDialog", () => {
  it("should render correctly", () => {
    advanceTo(new Date(2018, 5, 27, 0, 0, 0)) // r

    const { container } = render(
      <VideoPlayerDialog
        onClose={() => {}}
        src=""
        studentId=""
        thumbnailUrl=""
        createdAt={dayjs().toISOString()}
        videoId=""
      />
    )
    expect(container).toMatchSnapshot()
  })
})
