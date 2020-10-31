import React, { FC, useState } from "react"
import { Card, Flex } from "theme-ui"
import { t } from "@lingui/macro"
import dayjs, { Dayjs } from "../../dayjs"
import useGetObservation from "../../api/observations/useGetObservation"
import usePatchObservation from "../../api/observations/usePatchObservation"
import DataBox from "../DataBox/DataBox"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Input from "../Input/Input"
import { useGetCurriculumAreas } from "../../api/useGetCurriculumAreas"
import useVisibilityState from "../../hooks/useVisibilityState"
import Chip from "../Chip/Chip"
import DatePickerDialog from "../DatePickerDialog/DatePickerDialog"

interface Props {
  observationId: string
}
const ObservationMetaCard: FC<Props> = ({ observationId }) => {
  const { data } = useGetObservation(observationId)

  return (
    <Card sx={{ borderRadius: [0, "default"] }} mx={[0, 3]} mb={3}>
      <ShortDescription
        originalValue={data?.shortDesc}
        observationId={observationId}
      />
      <EventTime
        originalValue={dayjs(data?.eventTime)}
        observationId={observationId}
      />
      <Area originalValue={data?.area?.id} observationId={observationId} />
    </Card>
  )
}

const ShortDescription: FC<{
  originalValue?: string
  observationId: string
}> = ({ originalValue, observationId }) => {
  const [patchObservation, { isLoading }] = usePatchObservation(observationId)
  const [isEditing, setIsEditing] = useState(false)
  const [shortDesc, setShortDesc] = useState(originalValue)

  return (
    <>
      <DataBox
        label={t`Short Description`}
        value={originalValue ?? ""}
        onEditClick={() => setIsEditing(true)}
      />
      {isEditing && (
        <Dialog>
          <DialogHeader
            title={t`Edit Short Description`}
            onAcceptText={t`Save`}
            onCancel={() => setIsEditing(false)}
            loading={isLoading}
            onAccept={async () => {
              const result = await patchObservation({ shortDesc })
              if (result?.ok) {
                setIsEditing(false)
              }
            }}
          />
          <Input
            label={t`Short Description`}
            sx={{ width: "100%" }}
            onChange={(e) => setShortDesc(e.target.value)}
            value={shortDesc}
            containerSx={{ p: 3, backgroundColor: "background" }}
          />
        </Dialog>
      )}
    </>
  )
}

const Area: FC<{
  originalValue?: string
  observationId: string
}> = ({ originalValue, observationId }) => {
  const { data: areas } = useGetCurriculumAreas()
  const [patchObservation, { isLoading }] = usePatchObservation(observationId)
  const dialog = useVisibilityState()
  const [areaId, setValue] = useState(originalValue ?? "")

  const original = areas?.find((v) => v.id === originalValue)

  return (
    <>
      <DataBox
        label={t`Area`}
        value={original?.name ?? "-"}
        onEditClick={dialog.show}
      />
      {dialog.visible && (
        <Dialog>
          <DialogHeader
            title={t`Edit Area`}
            onAcceptText={t`Save`}
            onCancel={dialog.hide}
            loading={isLoading}
            onAccept={async () => {
              const result = await patchObservation({ areaId })
              if (result?.ok) dialog.hide()
            }}
          />
          <Flex
            px={3}
            pt={3}
            pb={2}
            sx={{ flexWrap: "wrap", backgroundColor: "background" }}
          >
            {areas?.map(({ name, id }) => {
              const isSelected = id === areaId
              return (
                <Chip
                  key={id}
                  text={name}
                  activeBackground="primary"
                  isActive={isSelected}
                  onClick={() => setValue(isSelected ? "" : id)}
                  mr={2}
                  mb={2}
                />
              )
            })}
          </Flex>
        </Dialog>
      )}
    </>
  )
}

const EventTime: FC<{
  originalValue?: Dayjs
  observationId: string
}> = ({ observationId, originalValue }) => {
  const [patchObservation, { isLoading }] = usePatchObservation(observationId)
  const dialog = useVisibilityState()

  return (
    <>
      <DataBox
        label={t`Event Time`}
        value={originalValue?.format("dddd, DD MMM YYYY") ?? ""}
        onEditClick={dialog.show}
      />
      {dialog.visible && (
        <DatePickerDialog
          isLoading={isLoading}
          defaultDate={originalValue}
          onDismiss={dialog.hide}
          onConfirm={async (eventTime) => {
            const result = await patchObservation({ eventTime })
            if (result?.ok) dialog.hide()
          }}
        />
      )}
    </>
  )
}

export default ObservationMetaCard
