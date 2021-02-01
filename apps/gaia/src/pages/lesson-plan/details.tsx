import Head from "next/head"
import Link from "next/link"
import { Suspense } from "preact/compat/src/suspense"
import React, { useState } from "react"
import Markdown from "../../components/Markdown/Markdown"
import useGetLessonPlan from "../../hooks/api/useGetlessonPlan"
import { useQueryString } from "../../hooks/useQueryString"
import BackIcon from "../../icons/arrow-back.svg"

enum ViewMode {
  Daily,
  All,
}

const LessonPlanDetails = () => {
  const childId = useQueryString("childId")
  const planId = useQueryString("planId")
  const [viewMode, setViewMode] = useState(ViewMode.All)
  const lessonPlan = useGetLessonPlan(planId)

  return (
    <div>
      <Head>
        <title>Lesson Plans | Obserfy for Parents</title>
      </Head>

      <div className="w-full border-b flex ">
        <div className="w-full max-w-3xl mx-auto flex px-1 items-center">
          <Link href={`/lesson-plan?childId=${childId}`}>
            <button
              onClick={() => setViewMode(ViewMode.Daily)}
              className="m-1 hover:text-green-700"
            >
              <BackIcon
                className={`
              w-4 h-4 m-2
              ${viewMode === ViewMode.Daily ? "text-green-700" : "opacity-80"}
            `}
              />
            </button>
          </Link>
          <Link href={`/lesson-plan?childId=${childId}`}>
            <div className="text-xs">Lesson Plans</div>
          </Link>
          <div className="mx-3">/</div>
          <div className="text-xs text-green-700">Details</div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="prose px-3 pt-3">
          <h2>{lessonPlan.data?.title}</h2>
        </div>
        {lessonPlan.data?.description && (
          <Markdown className="p-3" markdown={lessonPlan.data.description} />
        )}
      </div>
    </div>
  )
}

export default LessonPlanDetails
