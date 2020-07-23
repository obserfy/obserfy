/** @jsx jsx */
import { FC } from "react"
import { Button, Flex, jsx } from "theme-ui"
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
    <Flex sx={{ alignItems: "center" }}>
      <Icon as={InfoIcon} m={0} fill="warning" />
      <Typography.Body sx={{ fontSize: 1 }} ml={2} color="warning">
        Info
      </Typography.Body>
    </Flex>
    <Typography.Body sx={{ fontSize: 1 }} pb={2}>
      {message}
    </Typography.Body>
    <Link to={to} sx={{ ml: "auto", display: "inline-block" }}>
      <Button variant="outline" color="warning" sx={{ fontSize: 0 }}>
        {buttonText}
      </Button>
    </Link>
  </Flex>
)

export default InformationalCard
