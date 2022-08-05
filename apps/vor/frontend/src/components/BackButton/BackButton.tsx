import { FC } from "react"
import { Button } from "theme-ui"
import { ReactComponent as Arrow } from "../../icons/arrow-back.svg"
import Icon from "../Icon/Icon"
import { Link } from "../Link/Link"

export interface BackButtonProps {
  to: string
  state?: {
    preserveScroll: boolean
  }
}
export const BackButton: FC<BackButtonProps> = ({ to, state }) => (
  <Link
    to={to}
    sx={{ m: 2, flexShrink: 0 }}
    data-cy="back-button"
    state={state}
  >
    <Button p={1} variant="text">
      <Icon as={Arrow} sx={{ fill: "textMediumEmphasis" }} />
    </Button>
  </Link>
)

export default BackButton
