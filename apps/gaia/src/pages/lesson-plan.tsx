import Head from "next/head"
import React, { useState } from "react"
import LessonPlansByDate from "../components/LessonPlanByDates/LessonPlanByDates"
import LessonPlanOverview from "../components/LessonPlanOverview/LessonPlanOverview"
import CalendarIcon from "../icons/calendar.svg"
import ListIcon from "../icons/list.svg"

enum ViewMode {
  ByDates,
  Overview,
}

const IndexPage = () => {
  const [viewMode, setViewMode] = useState(ViewMode.Overview)

  return (
    <div>
      <Head>
        <title>Lesson Plans | Obserfy for Parents</title>
      </Head>

      <div className="w-full border-b flex ">
        <div className="w-full max-w-3xl mx-auto flex px-1">
          <button
            onClick={() => setViewMode(ViewMode.ByDates)}
            className="ml-auto m-1 hover:text-green-700"
          >
            <CalendarIcon
              className={`
              w-4 h-4 m-2
              ${viewMode === ViewMode.ByDates ? "text-green-700" : "opacity-80"}
            `}
            />
          </button>
          <button
            onClick={() => setViewMode(ViewMode.Overview)}
            className="m-1 hover:text-green-700"
          >
            <ListIcon
              className={`
              w-4 h-4 m-2
              ${
                viewMode === ViewMode.Overview ? "text-green-700" : "opacity-80"
              }
            `}
            />
          </button>
        </div>
      </div>

      {viewMode === ViewMode.ByDates && <LessonPlansByDate />}
      {viewMode === ViewMode.Overview && <LessonPlanOverview />}
    </div>
  )
}

export default IndexPage
