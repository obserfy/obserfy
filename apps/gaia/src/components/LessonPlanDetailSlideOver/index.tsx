import dayjs from "dayjs"
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
        <div className="px-4 lg:px-6 pt-4 mb-4 border-t">
          <p className="text-sm text-gray-500">Lesson</p>
          <h4 className="mb-2 leading-tight text-gray-900">{lp?.title}</h4>
        </div>

        <div className="px-4 lg:px-6 pb-4">
          <p className="text-sm text-gray-500">Date</p>
          <p className="flex mb-1 text-gray-900">
            {start.format("D MMM YYYY")}
            {isRepeating && (
              <span className="ml-1">{` - ${end?.format("D MMM YYYY")}`}</span>
            )}
          </p>
        </div>

        <div className="px-4 lg:px-6 pb-4 border-b">
          <p className="text-sm text-gray-500">Area</p>
          <h5 className="mb-2 font-semibold leading-tight text-primary-700">
            {lp?.areaName || "Other"}
          </h5>
        </div>

        {lp?.description && (
          <div className="p-4 lg:p-6 py-8 border-b">
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: lp.description }}
            />
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
  <div className="right-0 left-0 p-4 lg:p-6 sm:max-w-none bg-gray-50 border-b">
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
  <li className="relative right-0 left-0 mb-4 bg-surface rounded-lg border ring-0 hover:ring-2 hover:ring-primary-500 shadow-sm">
    <a
      href={url ?? "#"}
      rel="noopener noreferrer"
      target="_blank"
      className="flex items-center p-3"
    >
      <Icon
        src="/icons/link.svg"
        className="flex-shrink-0 mr-3"
        color="bg-gray-600"
      />
      <span className="flex-grow-0 text-sm break-all">{url}</span>
    </a>
  </li>
)

export default LessonPlanDetailsSlideOver
