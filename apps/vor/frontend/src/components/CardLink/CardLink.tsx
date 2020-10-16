/** @jsx jsx */
import { FC, PropsWithoutRef } from "react"
import { Card, CardProps, Flex, jsx } from "theme-ui"
import { Trans } from "@lingui/macro"
import { Link } from "../Link/Link"
import Typography from "../Typography/Typography"
import Icon from "../Icon/Icon"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"

interface Props extends PropsWithoutRef<CardProps> {
  name: string
  to: string
}
export const CardLink: FC<Props> = ({ name, to, ...props }) => (
  <Link to={to} sx={{ display: "block" }}>
    <Card p={3} {...props}>
      <Flex sx={{ alignItems: "center" }}>
        <Typography.Body sx={{ fontSize: [2, 2] }}>
          <Trans id={name} />
        </Typography.Body>
        <Icon as={NextIcon} ml="auto" />
      </Flex>
    </Card>
  </Link>
)

export default CardLink
