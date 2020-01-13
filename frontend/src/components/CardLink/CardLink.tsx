import React, { FC } from "react"
import { Link } from "gatsby-plugin-intl3"
import Card from "../Card/Card"
import Flex from "../Flex/Flex"
import Typography from "../Typography/Typography"
import Spacer from "../Spacer/Spacer"
import Icon from "../Icon/Icon"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { BoxProps } from "../Box/Box"

interface Props extends BoxProps {
  name: string
  to: string
}
export const CardLink: FC<Props> = ({ name, to, ...props }) => (
  <Link to={to}>
    <Card p={3} {...props}>
      <Flex alignItems="center">
        <Typography.H6>{name}</Typography.H6>
        <Spacer />
        <Icon as={NextIcon} m={0} />
      </Flex>
    </Card>
  </Link>
)

export default CardLink
