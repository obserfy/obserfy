import React, { FC } from "react"
import { navigate } from "../Link/Link"
import Flex from "../Flex/Flex"
import Typography from "../Typography/Typography"
import Button from "../Button/Button"
import Spacer from "../Spacer/Spacer"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import Dialog from "../Dialog/Dialog"
import useDeleteClass from "../../api/useDeleteClass"
import { CLASS_SETTINGS_URL } from "../../pages/dashboard/settings/class"

interface Props {
  onDismiss: () => void
  classId: string
  name: string
}
export const DeleteClassDialog: FC<Props> = ({ classId, onDismiss, name }) => {
  const [mutate, { status }] = useDeleteClass(classId)

  async function deleteClass(): Promise<void> {
    const result = await mutate()
    if (result) {
      await navigate(CLASS_SETTINGS_URL)
    }
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
        Delete Class?
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
      <Button m={2} backgroundColor="danger" onClick={deleteClass}>
        {status === "loading" && <LoadingIndicator />}
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

export default DeleteClassDialog
