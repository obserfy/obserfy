import React, { FC, useState } from "react"
import { getAnalytics } from "../../analytics"
import Flex from "../Flex/Flex"
import Typography from "../Typography/Typography"
import Dialog from "../Dialog/Dialog"
import Spacer from "../Spacer/Spacer"
import Button from "../Button/Button"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import { deleteSubjectApi } from "../../api/deleteSubjectApi"

interface Props {
  subjectId: string
  name: string
  onDismiss: () => void
  onDeleted: () => void
}
export const DeleteSubjectDialog: FC<Props> = ({
  onDeleted,
  onDismiss,
  subjectId,
  name,
}) => {
  const [loading, setLoading] = useState(false)

  async function deleteStudent(): Promise<void> {
    setLoading(true)
    const response = await deleteSubjectApi(subjectId)
    if (response.status === 200 || response.status === 400) {
      onDeleted()
      getAnalytics()?.track("Subject deleted", { statusCode: response.status })
    } else {
      getAnalytics()?.track("Subject delete fail", {
        statusCode: response.status,
        subjectId,
      })
    }
    setLoading(false)
  }

  const header = (
    <Flex
      backgroundColor="surface"
      justifyContent="center"
      p={3}
      sx={{
        flexShrink: 0,
        position: "relative",
        borderBottomColor: "border",
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
      }}
    >
      <Typography.H6
        sx={{
          pointerEvents: "none",
          alignContent: "center",
        }}
      >
        Delete subject?
      </Typography.H6>
    </Flex>
  )

  return (
    <Dialog maxWidth={["", "maxWidth.xsm"]}>
      {header}
      <Typography.Body
        p={3}
        sx={{
          borderBottomColor: "border",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
        }}
      >
        <i>&quot;{name}&quot;</i> and every data associated with it (student
        progress, materials, etc...) will be permanently deleted. Are you sure?
      </Typography.Body>
      <Flex alignItems="center">
        <Spacer />
        <Button variant="outline" m={2} onClick={onDismiss}>
          Cancel
        </Button>
        <Button m={2} backgroundColor="danger" onClick={deleteStudent}>
          {loading && <LoadingIndicator />}
          Yes
        </Button>
      </Flex>
    </Dialog>
  )
}

export default DeleteSubjectDialog
