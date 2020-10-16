/** @jsx jsx */
import { FC } from "react"
import { Button, Flex, jsx } from "theme-ui"
import { Trans } from "@lingui/macro"
import { Link } from "../Link/Link"
import Icon from "../Icon/Icon"
import { ReactComponent as InfoIcon } from "../../icons/info.svg"
import Typography from "../Typography/Typography"

interface Props {
  message: string
  buttonText: string
  to: string
}
export const InformationalCard: FC<Props> = ({ message, buttonText, to }) => (
  <Flex
    p={3}
    mt={3}
    backgroundColor="tintWarning"
    sx={{
      borderWidth: 1,
      borderColor: "warning",
      borderRadius: [0, "default"],
      flexDirection: "column",
    }}
  >
    <Flex sx={{ alignItems: "center" }} mb={1}>
      <Icon as={InfoIcon} fill="warning" />
      <Typography.Body sx={{ fontSize: 1 }} ml={2} color="warning">
        <Trans>Info</Trans>
      </Typography.Body>
    </Flex>
    <Typography.Body sx={{ fontSize: 1 }} pb={2}>
      <Trans id={message} />
    </Typography.Body>
    <Link to={to} sx={{ ml: "auto", display: "inline-block" }}>
      <Button variant="outline" color="warning" sx={{ fontSize: 0 }}>
        <Trans id={buttonText} />
      </Button>
    </Link>
  </Flex>
)

export default InformationalCard
