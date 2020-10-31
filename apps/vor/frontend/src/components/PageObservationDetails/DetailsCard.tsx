import React, { FC, useState } from "react"
import { Card } from "theme-ui"
import usePatchObservation from "../../api/observations/usePatchObservation"
import useVisibilityState from "../../hooks/useVisibilityState"
import MultilineDataBox from "../MultilineDataBox/MultilineDataBox"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import TextArea from "../TextArea/TextArea"

interface Props {
  originalValue: string
  observationId: string
}
const DetailsCard: FC<Props> = ({ originalValue, observationId }) => (
  <Card sx={{ borderRadius: [0, "default"] }} mx={[0, 3]} mb={3}>
    <LongTextDataBox
      originalValue={originalValue}
      observationId={observationId}
    />
  </Card>
)

const LongTextDataBox: FC<{
  originalValue?: string
  observationId: string
}> = ({ originalValue, observationId }) => {
  const [patchObservation, { isLoading }] = usePatchObservation(observationId)
  const [longDesc, setLongDesc] = useState(originalValue ?? "")
  const dialog = useVisibilityState()

  const label = "Details"

  return (
    <>
      <MultilineDataBox
        label={label}
        value={originalValue ?? ""}
        onEditClick={dialog.show}
        placeholder="-"
      />
      {dialog.visible && (
        <Dialog>
          <DialogHeader
            title={`Edit ${label}`}
            onAcceptText="Save"
            onCancel={dialog.hide}
            loading={isLoading}
            onAccept={async () => {
              const result = await patchObservation({ longDesc })
              if (result?.ok) dialog.hide()
            }}
          />
          <TextArea
            label={label}
            sx={{ width: "100%", lineHeight: 1.8, minHeight: 400 }}
            onChange={(e) => setLongDesc(e.target.value)}
            value={longDesc}
            containerSx={{ p: 3, backgroundColor: "background" }}
            placeholder="Write something"
          />
        </Dialog>
      )}
    </>
  )
}

export default DetailsCard
