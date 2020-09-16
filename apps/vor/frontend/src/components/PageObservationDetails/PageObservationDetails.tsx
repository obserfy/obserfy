import React, { FC, Fragment, useEffect, useRef, useState } from "react"
import { Box, Button, Card } from "theme-ui"
import useGetObservation from "../../api/observations/useGetObservation"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Input from "../Input/Input"
import usePatchObservation from "../../api/observations/usePatchObservation"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import DataBox from "../DataBox/DataBox"
import Icon from "../Icon/Icon"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import DeleteObservationDialog from "../DeleteObservationDialog/DeleteObservationDialog"
import { navigate } from "../Link/Link"

export interface PageObservationDetailsProps {
  observationId: string
  backUrl: string
}
export const PageObservationDetails: FC<PageObservationDetailsProps> = ({
  observationId,
  backUrl,
}) => {
  const { data, isLoading } = useGetObservation(observationId)
  const [isDeleting, setIsDeleting] = useState(false)
  const [patchObservation, patchObservationState] = usePatchObservation(
    observationId
  )

  if (isLoading) {
    return (
      <Box>
        <LoadingPlaceholder />
      </Box>
    )
  }

  return (
    <Box>
      <Card sx={{ borderRadius: [0, "default"] }} mx={[0, 3]}>
        <ShortTextDataBox
          label="Short Description"
          originalValue={data?.shortDesc}
          isLoading={patchObservationState.isLoading}
          onSave={async (shortDesc) => {
            const result = await patchObservation({ shortDesc })
            return result.ok
          }}
        />
      </Card>
      <Button
        variant="outline"
        color="danger"
        ml="auto"
        mr={3}
        my={3}
        onClick={() => setIsDeleting(true)}
      >
        <Icon as={TrashIcon} fill="danger" mr={2} />
        Delete
      </Button>
      {isDeleting && (
        <DeleteObservationDialog
          shortDesc={data?.shortDesc ?? ""}
          observationId={observationId}
          onDeleted={() => navigate(backUrl)}
          onDismiss={() => setIsDeleting(false)}
        />
      )}
    </Box>
  )
}

const ShortTextDataBox: FC<{
  label: string
  originalValue?: string
  onSave: (value: string) => Promise<boolean>
  isLoading?: boolean
}> = ({ label, originalValue, isLoading, onSave }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(originalValue ?? "")

  const inputField = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isEditing) {
      inputField.current?.focus()
    }
  }, [isEditing])

  return (
    <Fragment>
      <DataBox
        label={label}
        value={originalValue ?? ""}
        onEditClick={() => setIsEditing(true)}
      />
      {isEditing && (
        <Dialog>
          <DialogHeader
            title={`Edit ${label}`}
            onAcceptText="Save"
            onCancel={() => setIsEditing(false)}
            loading={isLoading}
            onAccept={async () => {
              const ok = await onSave(value)
              if (ok) {
                setIsEditing(false)
              }
            }}
          />
          <Input
            autoFocus
            label={label}
            sx={{ width: "100%" }}
            onChange={(e) => setValue(e.target.value)}
            value={value}
            ref={inputField}
            containerSx={{ p: 3, backgroundColor: "background" }}
          />
        </Dialog>
      )}
    </Fragment>
  )
}

export default PageObservationDetails
