import React, { FC, useState } from "react"
import { Svg } from "react-optimized-image/lib"
import LinkIcon from "../../icons/link.svg"
import Button from "../Button/Button"
import Textarea from "../Textarea/Textarea"
import usePostPlanObservation from "../../hooks/api/usePostPlanObservation"
import dayjs, { Dayjs } from "../../utils/dayjs"
import TrashIcon from "../../icons/trash.svg"
import usePatchObservation from "../../hooks/api/usePatchObservation"
import useDeleteObservation from "../../hooks/api/useDeleteObservation"
import Dialog from "../Dialog/Dialog"

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

  const renderedObservations = observations.map(
    ({ id, observation, createdAt }) => (
      <Observation
        key={id}
        id={id}
        createdAt={dayjs(createdAt)}
        observation={observation}
      />
    )
  )

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
      {observations.length > 0 && (
        <div className="mx-3 text-sm">Observations</div>
      )}
      {renderedObservations}
    </div>
  )
}

const AddObservationForm: FC<{
  onDismiss: () => void
  planId: string
  childId: string
}> = ({ onDismiss, planId, childId }) => {
  const [loading, setLoading] = useState(false)
  const [postObservation] = usePostPlanObservation(planId)
  const [observation, setObservation] = useState("")

  return (
    <>
      <div className="px-3 w-full">
        <Textarea
          className="w-full mt-3"
          label="Observation"
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="flex ml-auto">
        <Button
          outline
          className="ml-auto mr-3 mt-3"
          onClick={onDismiss}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          className="ml-auto mr-3 mt-3"
          disabled={loading}
          onClick={async () => {
            setLoading(true)
            const result = await postObservation({ observation, childId })
            setLoading(false)
            if (result?.ok) {
              onDismiss()
            }
          }}
        >
          {loading ? "Loading" : "Post"}
        </Button>
      </div>
    </>
  )
}

const Observation: FC<{
  id: string
  observation: string
  createdAt: Dayjs
}> = ({ id, observation, createdAt }) => {
  const [isEditing, setIsEditing] = useState(false)
  return (
    <div className="px-3 mt-2 text-gray-700 flex w-full">
      <div className="rounded-full bg-black w-1 flex-shrink-0 mr-3" />
      <div className="w-full">
        {isEditing && (
          <EditObservationForm
            observationId={id}
            original={observation}
            onDismiss={() => setIsEditing(false)}
          />
        )}
        {!isEditing && (
          <>
            <div>{observation}</div>
            <div className="flex mt-2 item-center w-full">
              <div className="text-sm">{createdAt.format("HH:mm")}</div>
              <Button
                outline
                className="ml-auto mr-3 text-sm underline cursor-pointer border-none p-0"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const EditObservationForm: FC<{
  observationId: string
  onDismiss: () => void
  original: string
}> = ({ observationId, original, onDismiss }) => {
  const [patchObservation, patching] = usePatchObservation(observationId)
  const [deleteObservation, deleting] = useDeleteObservation(observationId)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [observation, setObservation] = useState(original)

  return (
    <>
      <Textarea
        label="Edit observation"
        value={observation}
        onChange={(e) => setObservation(e.target.value)}
      />
      <div className="flex mt-2">
        <Button
          iconOnly
          outline
          className="mr-2 text-red-700 px-2"
          onClick={() => setShowDeleteDialog(true)}
          disabled={patching.isLoading}
        >
          <Svg src={TrashIcon} width={20} height={20} />
        </Button>
        <Button
          outline
          className="ml-auto mr-2"
          onClick={onDismiss}
          disabled={patching.isLoading}
        >
          Cancel
        </Button>
        <Button
          disabled={observation === original || patching.isLoading}
          onClick={async () => {
            const result = await patchObservation({ observation })
            if (result?.ok) {
              onDismiss()
            }
          }}
        >
          {patching.isLoading ? "Loading" : "Save"}
        </Button>
      </div>
      {showDeleteDialog && (
        <Dialog>
          <div className="text-xl mx-6 mb-6 mt-3">Delete this observation?</div>
          <div className="flex w-full">
            <Button
              outline
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting.isLoading}
            >
              Cancel
            </Button>
            <Button
              className="w-full bg-red-700 text-white ml-2"
              onClick={async () => {
                const result = await deleteObservation()
                if (result?.ok) {
                  onDismiss()
                }
              }}
              disabled={deleting.isLoading}
            >
              {deleting.isLoading ? "Loading" : "Yes"}
            </Button>
          </div>
        </Dialog>
      )}
    </>
  )
}

export default Plan
