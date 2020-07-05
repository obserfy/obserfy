import React, { FC, PropsWithoutRef } from "react"
import { Card, CardProps, Flex } from "theme-ui"
import { Link } from "../Link/Link"
import Typography from "../Typography/Typography"
import Spacer from "../Spacer/Spacer"
import Icon from "../Icon/Icon"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"

interface Props extends PropsWithoutRef<CardProps> {
  name: string
  to: string
}
export const CardLink: FC<Props> = ({ name, to, ...props }) => (
  <Link to={to}>
    <Card p={3} {...props}>
      <Flex sx={{ alignItems: "center" }}>
        <Typography.H6>{name}</Typography.H6>
        <Spacer />
        <Icon as={NextIcon} m={0} />
      </Flex>
    </Card>
  </Link>
)

export default CardLink
