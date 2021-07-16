import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Head from "next/head"
import { useState } from "react"
import AllLessonPlans from "../../components/AllLessonPlans/AllLessonPlans"
import DailyLessonPlans from "../../components/DailyLessonPlans/DailyLessonPlans"
import CalendarIcon from "../../icons/calendar.svg"
import ListIcon from "../../icons/list.svg"

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

      <div className="w-full flex ">
        <div className="w-full max-w-3xl mx-auto flex px-1">
          <button
            onClick={() => setViewMode(ViewMode.Daily)}
            className="ml-auto m-1 hover:text-green-700"
          >
            <CalendarIcon
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
            <ListIcon
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
