/** @jsx jsx */
import { FC, Fragment, useState } from "react"
import { Box, Card, jsx } from "theme-ui"
import { t } from "@lingui/macro"
import { useGetGuardian } from "../../api/guardians/useGetGuardian"
import { usePatchGuardian } from "../../api/guardians/usePatchGuardian"
import useVisibilityState from "../../hooks/useVisibilityState"
import DataBox from "../DataBox/DataBox"
import Dialog from "../Dialog/Dialog"
import Input from "../Input/Input"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import DialogHeader from "../DialogHeader/DialogHeader"

interface Props {
  guardianId: string
}
export const PageGuardianProfile: FC<Props> = ({ guardianId }) => {
  const { data, status } = useGetGuardian(guardianId)
  const [mutate] = usePatchGuardian(guardianId)

  if (status === "loading") {
    return (
      <Box>
        <LoadingPlaceholder sx={{ width: "100%", height: "10em" }} mb={3} />
        <LoadingPlaceholder sx={{ width: "100%", height: "10em" }} mb={3} />
        <LoadingPlaceholder sx={{ width: "100%", height: "10em" }} mb={3} />
        <LoadingPlaceholder sx={{ width: "100%", height: "10em" }} mb={3} />
      </Box>
    )
  }

  return (
    <Card sx={{ borderRadius: [0, "default"] }} mb={3} mx={[0, 3]}>
      <EditableTextAttribute
        currentValue={data?.name}
        label={t`Name`}
        onSubmit={async (name) => {
          const result = await mutate({ name })
          return result?.ok ?? false
        }}
      />
      <EditableTextAttribute
        currentValue={data?.email}
        label={t`Email`}
        onSubmit={async (email) => {
          const result = await mutate({ email })
          return result?.ok ?? false
        }}
      />
      <EditableTextAttribute
        currentValue={data?.phone}
        label={t`Phone`}
        onSubmit={async (phone) => {
          const result = await mutate({ phone })
          return result?.ok ?? false
        }}
      />
      <EditableTextAttribute
        label={t`Address`}
        currentValue={data?.address}
        onSubmit={async (address) => {
          const result = await mutate({ address })
          return result?.ok ?? false
        }}
      />
      <NoteDataBox
        value={data?.note}
        key={`note${data?.note}`}
        guardianId={guardianId}
      />
    </Card>
  )
}

const EditableTextAttribute: FC<{
  currentValue?: string
  label: string
  onSubmit: (value: string) => Promise<boolean>
}> = ({ currentValue = "", onSubmit, label }) => {
  const dialog = useVisibilityState()
  const [value, setValue] = useState(currentValue)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Fragment>
      <DataBox
        label={label}
        value={currentValue || "-"}
        onEditClick={dialog.show}
      />
      {dialog.visible && (
        <Dialog>
          <DialogHeader
            title={t`Edit Name`}
            onCancel={dialog.hide}
            loading={isLoading}
            onAccept={async () => {
              setIsLoading(true)
              const ok = await onSubmit(value)
              if (ok) {
                dialog.hide()
                setValue(currentValue)
              }
              setIsLoading(false)
            }}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <Input
              label={label}
              sx={{ width: "100%" }}
              onChange={(e) => setValue(e.target.value)}
              value={value}
            />
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

const NoteDataBox: FC<{ value?: string; guardianId: string }> = ({
  value,
  guardianId,
}) => {
  const [mutate, { status }] = usePatchGuardian(guardianId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [note, setNote] = useState(value)
  const saveNote = async () => {
    await mutate({ note })
    setShowEditDialog(false)
  }
  return (
    <Fragment>
      <DataBox
        label={t`Note`}
        value={value || "-"}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title={t`Edit Note`}
            onAcceptText={t`Save`}
            onCancel={() => setShowEditDialog(false)}
            onAccept={saveNote}
            loading={status === "loading"}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <Input
              label={t`Note`}
              sx={{ width: "100%" }}
              onChange={(e) => {
                setNote(e.target.value)
              }}
              value={note}
            />
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

export default PageGuardianProfile
