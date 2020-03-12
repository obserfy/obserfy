import React, { FC, useState } from "react"
import Dialog from "../Dialog/Dialog"
import Flex from "../Flex/Flex"
import Typography from "../Typography/Typography"
import Button from "../Button/Button"
import Spacer from "../Spacer/Spacer"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import { deleteAreaApi } from "../../api/deleteAreaApi"
import { getAnalytics } from "../../analytics"

interface Props {
  onDismiss: () => void
  onDeleted: () => void
  areaId: string
  name: string
}
export const DeleteAreaDialog: FC<Props> = ({
  areaId,
  onDismiss,
  onDeleted,
  name,
}) => {
  const [loading, setLoading] = useState(false)

  async function deleteStudent(): Promise<void> {
    setLoading(true)
    const response = await deleteAreaApi(areaId)
    if (response.status === 200 || response.status === 400) {
      onDeleted()
      getAnalytics()?.track("Area deleted", { statusCode: response.status })
    } else {
      getAnalytics()?.track("Area delete fail", {
        statusCode: response.status,
        areaId,
      })
    }
    setLoading(false)
  }

  const header = (
    <Flex
      alignItems="center"
      backgroundColor="surface"
      sx={{
        flexShrink: 0,
        position: "relative",
      }}
    >
      <Typography.H6
        width="100%"
        sx={{
          position: "absolute",
          pointerEvents: "none",
          textAlign: "center",
          alignContent: "center",
        }}
      >
        Delete Area?
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
        <i>&quot;{name}&quot;</i> and student data related to it will be
        permanently deleted. Are you sure?
      </Typography.Body>
    </Dialog>
  )
}

export default DeleteAreaDialog
