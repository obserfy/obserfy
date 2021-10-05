import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { useState } from "react"
import AllLessonPlans from "$components/AllLessonPlans/AllLessonPlans"
import DailyLessonPlans from "$components/DailyLessonPlans/DailyLessonPlans"
import Icon from "$components/Icon/Icon"
import BaseLayout from "$layouts/BaseLayout"

enum ViewMode {
  Daily,
  All,
}

const IndexPage = () => {
  const [viewMode, setViewMode] = useState(ViewMode.Daily)

  return (
    <BaseLayout title="Lesson Plans">
      <div className="flex w-full">
        <div className="flex px-1 mx-auto w-full max-w-3xl">
          <button
            onClick={() => setViewMode(ViewMode.Daily)}
            className="m-1 ml-auto hover:text-green-700"
          >
            <Icon
              src="/icons/list.svg"
              className={`
              w-4 h-4 m-2
              ${viewMode === ViewMode.Daily ? "text-green-700" : "opacity-80"}
            `}
            />
          </button>
          <button
            onClick={() => setViewMode(ViewMode.All)}
            className="m-1 hover:text-green-700"
          >
            <Icon
              src="/icons/calendar.svg"
              className={`
              w-4 h-4 m-2
              ${viewMode === ViewMode.All ? "text-green-700" : "opacity-80"}
            `}
            />
          </button>
        </div>
      </div>

      {viewMode === ViewMode.Daily && <DailyLessonPlans />}
      {viewMode === ViewMode.All && <AllLessonPlans />}
    </BaseLayout>
  )
}

export default withPageAuthRequired(IndexPage)
