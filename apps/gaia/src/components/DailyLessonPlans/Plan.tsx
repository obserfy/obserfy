import { FC, useState } from "react"
import { isEmpty } from "../../utils/array"
import dayjs from "../../utils/dayjs"
import AddObservationForm from "../AddObservationForm"
import Button from "../Button/Button"
import Icon from "../Icon/Icon"
import LessonPlanObservation from "../LessonPlanObservation"
import Markdown from "../Markdown/Markdown"

interface Props {
  planId: string
  childId: string
  name: string
  area: string
  description?: string
  files: Array<{
    link: string
    name: string
  }>
  links: Array<{
    id: string
    url: string
    title?: string
    description?: string
    image?: string
  }>
  observations: Array<{
    id: string
    observation: string
    createdAt: string
  }>
}

const Plan: FC<Props> = ({
  childId,
  planId,
  name,
  area,
  files,
  description,
  links,
  observations,
}) => {
  const [showAddObservationForm, setShowAddObservationForm] = useState(false)

  return (
    <div className="flex flex-col items-start bg-surface md:rounded mb-2 border py-3">
      {area && <div className="text-sm text-green-700 px-3 mb-2">{area}</div>}
      <div className="text-md px-3 font-bold">{name}</div>
      <Markdown
        className="text-gray-700 my-2 px-3"
        markdown={description ?? ""}
      />

      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          className="overflow-x-auto max-w-full px-3 py-2 flex items-center text-sm leading-tight block"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon src="/icons/link.svg" className="flex-shrink-0" size={16} />
          <div className="whitespace-no-wrap ml-2">{link.url}</div>
        </a>
      ))}

      {files.length > 0 && (
        <div className="text-sm text-gray-700 mb-1">Files</div>
      )}

      {showAddObservationForm ? (
        <AddObservationForm
          planId={planId}
          childId={childId}
          onDismiss={() => setShowAddObservationForm(false)}
        />
      ) : (
        <Button
          outline
          className="ml-auto mr-3 mt-3"
          onClick={() => setShowAddObservationForm(true)}
        >
          Add observation
        </Button>
      )}

      {!isEmpty(observations) && (
        <div className="mx-3 text-sm">Observations</div>
      )}

      {observations.map(({ id, observation, createdAt }) => (
        <LessonPlanObservation
          key={id}
          id={id}
          createdAt={dayjs(createdAt)}
          observation={observation}
        />
      ))}
    </div>
  )
}

export default Plan
