import React, { FC } from "react"
import AlertDialog from "../AlertDialog/AlertDialog"

interface Props {
  student: { id: string; name: string }
  onConfirm: () => void
  onCancel: () => void
}
export const DeleteStudentDialog: FC<Props> = ({
  student,
  onCancel,
  onConfirm,
}) => (
  <AlertDialog
    title="Delete Student?"
    negativeText="NO, DON'T!"
    positiveText="Yes, please"
    body={`"${student.name}" will be permanently deleted.`}
    onPositiveClick={onConfirm}
    onNegativeClick={onCancel}
    onDismiss={onCancel}
  />
)

export default DeleteStudentDialog
