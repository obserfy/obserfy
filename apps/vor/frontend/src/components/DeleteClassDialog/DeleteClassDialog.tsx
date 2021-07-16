import { FC } from "react"
import { Flex, Button } from "theme-ui"
import { Trans } from "@lingui/macro"
import { navigate } from "../Link/Link"
import Typography from "../Typography/Typography"

import Spacer from "../Spacer/Spacer"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import Dialog from "../Dialog/Dialog"
import useDeleteClass from "../../hooks/api/classes/useDeleteClass"
import { CLASS_SETTINGS_URL } from "../../routes"

interface Props {
  onDismiss: () => void
  classId: string
  name: string
}
export const DeleteClassDialog: FC<Props> = ({ classId, onDismiss, name }) => {
  const { mutateAsync, status } = useDeleteClass(classId)

  async function deleteClass(): Promise<void> {
    try {
      await mutateAsync()
      await navigate(CLASS_SETTINGS_URL)
    } catch (e) {
      Sentry.captureException(e)
    }
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
        <Trans>Delete Class?</Trans>
      </Typography.H6>
      <Button
        variant="outline"
        m={2}
        onClick={onDismiss}
        sx={{ flexShrink: 0 }}
      >
        <Trans>Cancel</Trans>
      </Button>
      <Spacer />
      <Button m={2} backgroundColor="danger" onClick={deleteClass}>
        {status === "loading" && <LoadingIndicator />}
        <Trans>Yes</Trans>
      </Button>
    </Flex>
  )

  return (
    <Dialog sx={{ maxWidth: ["", "maxWidth.xsm"] }}>
      {header}
      <Typography.Body
        p={3}
        sx={{
          borderBottomColor: "border",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
        }}
      >
        <Trans>
          <i>&quot;{name}&quot;</i> and student data related to it will be
          permanently deleted. Are you sure?
        </Trans>
      </Typography.Body>
    </Dialog>
  )
}

export default DeleteClassDialog
