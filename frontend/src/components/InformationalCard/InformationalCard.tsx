import React, { FC } from "react"
import { Link } from "gatsby-plugin-intl3"
import Flex from "../Flex/Flex"
import Icon from "../Icon/Icon"
import { ReactComponent as InfoIcon } from "../../icons/info.svg"
import Typography from "../Typography/Typography"
import Spacer from "../Spacer/Spacer"
import Button from "../Button/Button"
import Box from "../Box/Box"

interface Props {
  message: string
  buttonText: string
  to: string
}
export const InformationalCard: FC<Props> = ({ message, buttonText, to }) => (
  <Box
    p={3}
    mt={3}
    backgroundColor="tintWarning"
    sx={{
      borderWidth: 1,
      borderColor: "warning",
      borderRadius: [0, "default"],
    }}
  >
    <Flex alignItems="center">
      <Icon as={InfoIcon} m={0} fill="warning" />
      <Typography.Body fontSize={1} ml={2} color="warning">
        Info
      </Typography.Body>
    </Flex>
    <Typography.Body fontSize={1} pb={2}>
      {message}
    </Typography.Body>
    <Flex>
      <Spacer />
      <Link to={to}>
        <Button variant="outline" color="warning" fontSize={0}>
          {buttonText}
        </Button>
      </Link>
    </Flex>
  </Box>
)

export default InformationalCard
