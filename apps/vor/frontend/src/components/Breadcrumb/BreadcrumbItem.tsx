import { FC } from "react"
import { Box, ThemeUIStyleObject } from "theme-ui"
import { Link } from "../Link/Link"

interface Props {
  to?: string
}
export const BreadcrumbItem: FC<Props> = ({ to, children }) => {
  const sx: ThemeUIStyleObject = {
    display: "inline-block",
    fontSize: 0,
    color: "textMediumEmphasis",
    whiteSpace: "nowrap",
    "&:last-child": {
      color: "textPrimary",
      "& > .splitter": {
        display: "none",
      },
    },
  }

  if (to) {
    return (
      <Link to={to} sx={sx} state={{ preserveScroll: true }}>
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
