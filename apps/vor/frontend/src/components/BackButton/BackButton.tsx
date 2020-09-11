/** @jsx jsx */
import { FC } from "react"
import { jsx, Button } from "theme-ui"
import Icon from "../Icon/Icon"
import { ReactComponent as Arrow } from "../../icons/arrow-back.svg"
import { Link } from "../Link/Link"

export interface BackButtonProps {
  to: string
}
export const BackButton: FC<BackButtonProps> = ({ to }) => (
  <Link to={to} sx={{ m: 2, flexShrink: 0 }}>
    <Button p={1} variant="secondary">
      <Icon as={Arrow} sx={{ fill: "textMediumEmphasis" }} />
    </Button>
  </Link>
)

export default BackButton
