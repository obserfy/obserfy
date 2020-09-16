import React, { FC, Fragment, useEffect, useRef, useState } from "react"
import { Box, Card } from "theme-ui"
import useGetObservation from "../../api/observations/useGetObservation"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Input from "../Input/Input"
import usePatchObservation from "../../api/observations/usePatchObservation"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import DataBox from "../DataBox/DataBox"

export interface PageObservationDetailsProps {
  observationId: string
}
export const PageObservationDetails: FC<PageObservationDetailsProps> = ({
  observationId,
}) => {
  const { data, isLoading } = useGetObservation(observationId)
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
      <Card sx={{ borderRadius: [0, "default"] }}>
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
