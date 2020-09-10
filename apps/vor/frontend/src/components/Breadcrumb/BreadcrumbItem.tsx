/** @jsx jsx */
import { FC } from "react"
import { jsx } from "theme-ui"
import { Link } from "../Link/Link"

interface Props {
  to: string
}
export const BreadcrumbItem: FC<Props> = ({ to, children }) => (
  <Link
    to={to}
    sx={{
      fontSize: 1,
      color: "textMediumEmphasis",
      ml: 2,
      lineHeight: 1,
      "&:last-child": {
        color: "text",
        "& > .splitter": {
          display: "none",
        },
      },
    }}
  >
    {children} <span className="splitter">/</span>
  </Link>
)

export default BreadcrumbItem
