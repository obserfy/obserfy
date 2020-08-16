import React, { FC, useState } from "react"
import { Svg } from "react-optimized-image/lib"
import LinkIcon from "../../icons/link.svg"
import Button from "../Button/Button"
import Textarea from "../Textarea/Textarea"
import usePostPlanObservation from "../../hooks/api/usePostPlanObservation"

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
}

const Plan: FC<Props> = ({
  childId,
  planId,
  name,
  area,
  files,
  description,
  links,
}) => {
  const [showAddObservationForm, setShowAddObservationForm] = useState(false)
  const [postObservation] = usePostPlanObservation(planId)

  const renderedDescription = description
    ?.split("\n")
    ?.filter((text) => text !== "")
    ?.map((text) => <div className="text-gray-700 my-2 px-3">{text}</div>)

  const renderedLinks = links.map((link) => (
    <a
      key={link.id}
      href={link.url}
      className="overflow-x-auto max-w-full px-3 py-2 flex items-center text-sm leading-tight"
      rel="noopener noreferrer"
      target="_blank"
    >
      <Svg src={LinkIcon} className="w-5 h-5 mr-2 fill-current flex-shrink-0" />
      <div className="whitespace-no-wrap">{link.url}</div>
    </a>
  ))

  const renderedFiles = files.length > 0 && (
    <div className="text-sm text-gray-700 mb-1">Files</div>
  )

  return (
    <div className="flex flex-col items-start bg-surface md:rounded mb-2 border py-3">
      {area && <div className="text-sm text-green-700 px-3 mb-2">{area}</div>}
      <div className="text-md px-3">{name}</div>
      {renderedDescription}
      {renderedLinks}
      {renderedFiles}
      {showAddObservationForm ? (
        <AddObservationForm
          onCancel={() => setShowAddObservationForm(false)}
          onSubmit={async (observation) => {
            await postObservation({ observation, childId })
          }}
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
    </div>
  )
}

const AddObservationForm: FC<{
  onCancel: () => void
  onSubmit: (observation: string) => void
}> = ({ onSubmit, onCancel }) => {
  const [observation, setObservation] = useState("")

  return (
    <>
      <div className="px-3 w-full">
        <Textarea
          className="w-full mt-3"
          label="Observation"
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
        />
      </div>
      <div className="flex ml-auto">
        <Button outline className="ml-auto mr-3 mt-3" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="ml-auto mr-3 mt-3"
          onClick={() => onSubmit(observation)}
        >
          Post
        </Button>
      </div>
    </>
  )
}

export default Plan
