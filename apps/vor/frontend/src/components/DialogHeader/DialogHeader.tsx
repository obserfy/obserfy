import { Trans } from "@lingui/macro"
import { FC } from "react"
import { Button, Flex } from "theme-ui"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import Typography from "../Typography/Typography"

interface Props {
  onCancel?: () => void
  onCancelText?: string
  onAccept?: () => void
  onAcceptText?: string
  title: string
  loading?: boolean
  disableAccept?: boolean
}
export const DialogHeader: FC<Props> = ({
  title,
  onAccept,
  onAcceptText = "Save",
  onCancel,
  onCancelText = "Cancel",
  loading,
  disableAccept,
}) => (
  <Flex
    backgroundColor="surface"
    py={1}
    sx={{
      alignItems: "center",
      position: "relative",
    }}
  >
    <Typography.H6
      sx={{
        fontSize: 2,
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
      variant="text"
      color="danger"
      my={1}
      onClick={onCancel}
      ml={2}
      data-cy="cancel"
    >
      <Trans id={onCancelText} />
    </Button>
    <Button
      variant="text"
      ml="auto"
      my={1}
      onClick={onAccept}
      mr={2}
      data-cy="confirm"
      disabled={disableAccept}
    >
      {loading && <LoadingIndicator />} <Trans id={onAcceptText} />
    </Button>
  </Flex>
)

export default DialogHeader
