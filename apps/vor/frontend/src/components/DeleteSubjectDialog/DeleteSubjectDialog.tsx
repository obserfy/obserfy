import React, { FC, useState } from "react"
import { Flex, Button } from "theme-ui"

import Typography from "../Typography/Typography"
import Dialog from "../Dialog/Dialog"
import Spacer from "../Spacer/Spacer"

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
      analytics.track("Subject deleted", { statusCode: response.status })
    } else {
      analytics.track("Subject delete fail", {
        statusCode: response.status,
        subjectId,
      })
    }
    setLoading(false)
  }

  const header = (
    <Flex
      backgroundColor="surface"
      sx={{
        alignItems: "center",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <Typography.H6
        sx={{
          width: "100%",
          position: "absolute",
          pointerEvents: "none",
          textAlign: "center",
          alignContent: "center",
        }}
      >
        Delete Subject?
      </Typography.H6>
      <Button
        variant="outline"
        m={2}
        onClick={onDismiss}
        sx={{ flexShrink: 0 }}
      >
        Cancel
      </Button>
      <Spacer />
      <Button m={2} backgroundColor="danger" onClick={deleteStudent}>
        {loading && <LoadingIndicator />}
        Yes
      </Button>
    </Flex>
  )

  return (
    <Dialog sx={{ maxWidth: ["", "maxWidth.xsm"] }}>
      {header}
      <Typography.Body p={3}>
        <i>&quot;{name}&quot;</i> and student data related to it will be
        permanently deleted. Are you sure?
      </Typography.Body>
    </Dialog>
  )
}

export default DeleteSubjectDialog
