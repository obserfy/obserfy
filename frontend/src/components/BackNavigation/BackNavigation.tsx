import React, { FC } from "react"
import { Link } from "gatsby-plugin-intl3"
import Icon from "../Icon/Icon"
import { ReactComponent as Arrow } from "../../icons/arrow-back.svg"
import Typography from "../Typography/Typography"
import Flex from "../Flex/Flex"

interface Props {
  to: string
  text: string
}
export const BackNavigation: FC<Props> = ({ to, text }) => (
  <Link to={to} state={{ preserveScroll: true }}>
    <Flex alignItems="center" ml={-2}>
      <Icon as={Arrow} mr={1} size={24} sx={{ fill: "textMediumEmphasis" }} />
      <Typography.Body mb={0} color="textMediumEmphasis">
        {text}
      </Typography.Body>
    </Flex>
  </Link>
)

export default BackNavigation
