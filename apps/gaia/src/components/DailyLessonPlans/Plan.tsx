import { FC, useState } from "react"
import { isEmpty } from "../../utils/array"
import dayjs from "$lib/dayjs"
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
    <div className="flex flex-col items-start py-3 mb-2 bg-surface md:rounded border">
      {area && <div className="px-3 mb-2 text-sm text-green-700">{area}</div>}
      <div className="px-3 font-bold text-md">{name}</div>
      <Markdown
        className="px-3 my-2 text-gray-700"
        markdown={description ?? ""}
      />

      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          className="flex overflow-x-auto items-center py-2 px-3 max-w-full text-sm leading-tight"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon src="/icons/link.svg" className="flex-shrink-0 !w-3" />
          <div className="ml-2 whitespace-no-wrap">{link.url}</div>
        </a>
      ))}

      {files.length > 0 && (
        <div className="mb-1 text-sm text-gray-700">Files</div>
      )}

      {showAddObservationForm ? (
        <AddObservationForm
          planId={planId}
          childId={childId}
          onDismiss={() => setShowAddObservationForm(false)}
        />
      ) : (
        <Button
          variant="outline"
          className="mt-3 mr-3 ml-auto"
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
