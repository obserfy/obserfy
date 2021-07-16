import { Trans } from "@lingui/macro"
import { FC } from "react"
import { Button, Flex } from "theme-ui"
import { borderBottom } from "../../border"
import Dialog from "../Dialog/Dialog"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

import Spacer from "../Spacer/Spacer"
import Typography from "../Typography/Typography"

interface Props {
  onDismiss: () => void
  onAccept: () => void
  title: string
  description: string
  loading?: boolean
}
export const WarningDialog: FC<Props> = ({
  onDismiss,
  title,
  description,
  onAccept,
  loading,
}) => (
  <Dialog sx={{ maxWidth: ["", "maxWidth.xsm"] }}>
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
        <Trans id={title} />
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
      <Button m={2} backgroundColor="danger" onClick={onAccept}>
        {loading && <LoadingIndicator />}
        <Trans>Yes</Trans>
      </Button>
    </Flex>
    <Typography.Body p={3} sx={borderBottom}>
      <Trans id={description} />
    </Typography.Body>
  </Dialog>
)

export default WarningDialog
