/** @jsx jsx */
import { FC } from "react"
import { SxStyleProp, Box, jsx } from "theme-ui"
import { Link } from "../Link/Link"

interface Props {
  to?: string
}
export const BreadcrumbItem: FC<Props> = ({ to, children }) => {
  const sx: SxStyleProp = {
    fontSize: 0,
    color: "textMediumEmphasis",
    lineHeight: 1,
    whiteSpace: "nowrap",
    "&:last-child": {
      color: "text",
      "& > .splitter": {
        display: "none",
      },
    },
  }

  if (to) {
    return (
      <Link to={to} sx={sx}>
        <span sx={{ "&:hover": { textDecoration: "underline" } }}>
          {children}
        </span>
        <span className="splitter" sx={{ mx: 1 }}>
          /
        </span>
      </Link>
    )
  }

  return (
    <Box sx={sx}>
      {children}
      <span className="splitter">/</span>
    </Box>
  )
}

export default BreadcrumbItem
