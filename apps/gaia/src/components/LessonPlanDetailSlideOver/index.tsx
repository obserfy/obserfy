import Markdown from "$components/Markdown/Markdown"
import dayjs from "$lib/dayjs"
import { FC } from "react"
import Icon from "$components/Icon/Icon"
import { ObservationsList } from "$components/LessonPlanDetailSlideOver/observation"
import SlideOver from "$components/SlideOver"
import useGetLessonPlan from "$hooks/api/useGetlessonPlan"
import { useQueryString } from "$hooks/useQueryString"

const LessonPlanDetailsSlideOver: FC<{
  show: boolean
  onClose: () => void
  lessonPlanId: string
}> = ({ lessonPlanId, show, onClose }) => {
  const studentId = useQueryString("studentId")
  const { data: lp } = useGetLessonPlan(lessonPlanId)

  const start = dayjs(lp?.startDate)
  const end = dayjs(lp?.endDate)
  const isRepeating = lp?.repetitionType !== "0" && end && start.isBefore(end)

  return (
    <SlideOver show={show} onClose={onClose} title="Details">
      <div>
        <div className="mb-4 border-t px-4 pt-4 lg:px-6">
          <p className="text-sm text-gray-500">Lesson</p>
          <h4 className="mb-2 leading-tight text-gray-900">{lp?.title}</h4>
        </div>

        <div className="px-4 pb-4 lg:px-6">
          <p className="text-sm text-gray-500">Date</p>
          <p className="mb-1 flex text-gray-900">
            {start.format("D MMM YYYY")}
            {isRepeating && (
              <span className="ml-1">{` - ${end?.format("D MMM YYYY")}`}</span>
            )}
          </p>
        </div>

        <div className="border-b px-4 pb-4 lg:px-6">
          <p className="text-sm text-gray-500">Area</p>
          <h5 className="mb-2 font-semibold leading-tight text-primary-700">
            {lp?.areaName || "Other"}
          </h5>
        </div>

        {lp?.description && (
          <div className="border-b p-4 py-8 lg:p-6">
            <Markdown markdown={lp?.descriptionHTML} />
          </div>
        )}

        {lp?.links && lp.links.length > 0 && (
          <LessonPlanLinkLists links={lp.links} />
        )}

        {lp?.observations && (
          <ObservationsList
            lessonPlanId={lessonPlanId}
            studentId={studentId}
            observations={lp.observations}
          />
        )}
      </div>
    </SlideOver>
  )
}

const LessonPlanLinkLists: FC<{
  links: Array<{ id?: string | null; url?: string | null }>
}> = ({ links }) => (
  <div className="inset-x-0 border-b bg-gray-50 p-4 sm:max-w-none lg:p-6">
    <h4 className="mb-2 text-gray-600">Links</h4>
    <ul>
      {links.map(({ id, url }) => (
        <LessonPlanLinks key={id} url={url} />
      ))}
    </ul>
  </div>
)

const LessonPlanLinks: FC<{
  url?: string | null
}> = ({ url }) => (
  <li className="relative inset-x-0 mb-4 rounded-lg border bg-surface shadow-sm ring-0 hover:ring-2 hover:ring-primary-500">
    <a
      href={url ?? "#"}
      rel="noopener noreferrer"
      target="_blank"
      className="flex items-center p-3"
    >
      <Icon
        src="/icons/link.svg"
        className="mr-3 shrink-0"
        color="bg-gray-600"
      />
      <span className="grow-0 break-all text-sm">{url}</span>
    </a>
  </li>
)

export default LessonPlanDetailsSlideOver
