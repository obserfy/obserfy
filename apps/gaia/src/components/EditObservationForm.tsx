import { FC, useState } from "react"
import useDeleteObservation from "../hooks/api/useDeleteObservation"
import usePatchObservation from "../hooks/api/usePatchObservation"
import Button from "./Button/Button"
import Dialog from "./Dialog/Dialog"
import Icon from "./Icon/Icon"
import Textarea from "./Textarea/Textarea"

export const EditObservationForm: FC<{
  observationId: string
  onDismiss: () => void
  original: string
}> = ({ observationId, original, onDismiss }) => {
  const patchObservation = usePatchObservation(observationId)
  const deleteObservation = useDeleteObservation(observationId)
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
          data-cy="delete-observation"
          // iconOnly TODO: create icon button component
          variant="outline"
          className="px-2 mr-2 text-red-700"
          onClick={() => setShowDeleteDialog(true)}
          disabled={patchObservation.isLoading}
        >
          <Icon src="/icons/trash.svg" />
        </Button>
        <Button
          variant="outline"
          className="mr-2 ml-auto"
          onClick={onDismiss}
          disabled={patchObservation.isLoading}
        >
          Cancel
        </Button>
        <Button
          disabled={observation === original || patchObservation.isLoading}
          onClick={async () => {
            try {
              await patchObservation.mutateAsync({ observation })
              onDismiss()
            } catch (e) {
              Sentry.captureException(e)
            }
          }}
        >
          {patchObservation.isLoading ? "Loading" : "Save"}
        </Button>
      </div>
      {showDeleteDialog && (
        <Dialog>
          <div className="mx-6 mt-3 mb-6 text-xl">Delete this observation?</div>
          <div className="flex w-full">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleteObservation.isLoading}
            >
              Cancel
            </Button>
            <Button
              className="ml-2 w-full text-white bg-red-700"
              onClick={async () => {
                try {
                  await deleteObservation.mutateAsync()
                  onDismiss()
                } catch (e) {
                  Sentry.captureException(e)
                }
              }}
              disabled={deleteObservation.isLoading}
            >
              {deleteObservation.isLoading ? "Loading" : "Yes"}
            </Button>
          </div>
        </Dialog>
      )}
    </>
  )
}
