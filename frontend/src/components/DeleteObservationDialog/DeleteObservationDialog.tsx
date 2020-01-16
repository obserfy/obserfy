import React, { FC } from "react"
import AlertDialog from "../AlertDialog/AlertDialog"
import { Observation } from "../../api/useGetObservations"

interface Props {
  observation: Observation
  onConfirm: (observation: Observation) => void
  onCancel: () => void
}
export const DeleteObservationDialog: FC<Props> = ({
  observation,
  onCancel,
  onConfirm,
}) => (
  <AlertDialog
    title="Delete observation?"
    negativeText="NO, DON'T!"
    positiveText="Yes, please"
    body={`"${observation.shortDesc}" will be permanently deleted.`}
    onPositiveClick={() => onConfirm(observation)}
    onNegativeClick={onCancel}
    onDismiss={onCancel}
  />
)

export default DeleteObservationDialog
