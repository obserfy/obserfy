import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Head from "next/head"
import Link from "next/link"
import Icon from "../../components/Icon/Icon"
import Markdown from "../../components/Markdown/Markdown"
import useGetLessonPlan from "../../hooks/api/useGetlessonPlan"
import { useQueryString } from "../../hooks/useQueryString"

const LessonPlanDetails = () => {
  const childId = useQueryString("childId")
  const planId = useQueryString("planId")
  const lessonPlan = useGetLessonPlan(planId)

  return (
    <div>
      <Head>
        <title>Lesson Plans | Obserfy for Parents</title>
      </Head>

      <div className="flex w-full border-b">
        <div className="flex items-center px-1 mx-auto w-full max-w-3xl">
          <Link href={`/lesson-plan?childId=${childId}`}>
            <button className="m-1 hover:text-green-700">
              <Icon src="/icons/arrow-back.svg" className="m-2 w-4 h-4" />
            </button>
          </Link>
          <Link href={`/lesson-plan?childId=${childId}`}>
            <div className="text-xs">Lesson Plans</div>
          </Link>
          <div className="mx-3">/</div>
          <div className="text-xs text-green-700">Details</div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="px-3 pt-3 prose">
          <h2>{lessonPlan.data?.title}</h2>
        </div>

        {lessonPlan.data?.description && (
          <Markdown
            className="p-3 max-w-lg"
            markdown={lessonPlan.data.description}
          />
        )}

        <div>
          {lessonPlan.data?.links.map((l) => (
            <a
              key={l.id}
              href={l.url}
              className="flex overflow-x-auto items-center py-2 px-3 max-w-full text-sm leading-tight hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon src="/icons/link.svg" className="flex-shrink-0 !w-3" />
              <div className="ml-2 whitespace-no-wrap">{l.url}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default withPageAuthRequired(LessonPlanDetails)
