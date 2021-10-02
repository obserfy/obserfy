import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Icon from "@components/Icon/Icon"
import Head from "next/head"
import { useState } from "react"
import AllLessonPlans from "../../components/AllLessonPlans/AllLessonPlans"
import DailyLessonPlans from "../../components/DailyLessonPlans/DailyLessonPlans"

enum ViewMode {
  Daily,
  All,
}

const IndexPage = () => {
  const [viewMode, setViewMode] = useState(ViewMode.Daily)

  return (
    <div>
      <Head>
        <title>Lesson Plans | Obserfy for Parents</title>
      </Head>

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
    </div>
  )
}

export default withPageAuthRequired(IndexPage)
