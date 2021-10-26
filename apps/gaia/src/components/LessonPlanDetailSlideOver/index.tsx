import { FC } from "react"
import Icon from "$components/Icon/Icon"
import {
  Observation,
  PostObservationForm,
} from "$components/LessonPlanDetailSlideOver/Observation"
import SlideOver from "$components/SlideOver"
import useGetLessonPlan from "$hooks/api/useGetlessonPlan"
import { useQueryString } from "$hooks/useQueryString"
import dayjs from "$lib/dayjs"

const LessonPlanDetailsSlideOver: FC<{
  show: boolean
  onClose: () => void
  lessonPlanId: string
}> = ({ lessonPlanId, show, onClose }) => {
  const studentId = useQueryString("studentId")
  const { data: lp } = useGetLessonPlan(lessonPlanId)

  return (
    <SlideOver show={show} onClose={onClose} title="Details">
      <div>
        <div className="px-4 lg:px-6 pt-4 mb-4 border-t">
          <p className="text-gray-600">Lesson Name</p>
          <h4 className="mb-2 font-semibold leading-tight text-gray-800">
            {lp?.title}
          </h4>
        </div>

        <div className="px-4 lg:px-6 pb-4 border-b">
          <p className="text-gray-600">Area</p>
          <h5 className="mb-2 font-semibold leading-tight text-primary-800">
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

        {(lp?.links?.length ?? 0) > 0 && (
          <div className="right-0 left-0 p-4 lg:p-6 sm:max-w-none bg-gray-100 border-b">
            <h4 className="mb-2 text-gray-600">Links</h4>
            <ul>
              {lp?.links.map((l) => (
                <li
                  key={l.id}
                  className="relative right-0 left-0 mb-4 bg-surface rounded-lg border ring-0 hover:ring-2 hover:ring-primary-500 shadow-sm"
                >
                  <a
                    href={l.url ?? "#"}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="flex items-center p-3"
                  >
                    <Icon
                      src="/icons/link.svg"
                      className="flex-shrink-0 mr-3"
                      color="bg-gray-600"
                    />
                    <span className="flex-grow-0 text-sm break-all">
                      {l.url}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-4 lg:p-6 bg-gray-100 border-b">
          <h4 className="mb-2 text-gray-600">Observations</h4>
          <ul>
            {lp?.observations.map((o) => (
              <Observation
                key={o.id}
                long_desc={o.long_desc}
                event_time={dayjs(o.event_time)}
              />
            ))}
          </ul>

          <PostObservationForm lessonPlanId={lp?.id} studentId={studentId} />
        </div>
      </div>
    </SlideOver>
  )
}

export default LessonPlanDetailsSlideOver
