import React, { FC } from "react"
import { Box } from "theme-ui"
import { useBreakpointIndex } from "@theme-ui/match-media"
import StudentsList from "../StudentsList/StudentsList"

export const PageHome: FC = () => {
  const breakpoint = useBreakpointIndex({ defaultIndex: 0 })

  if (breakpoint > 1) {
    return <></>
  }

  return (
    <Box sx={{ display: ["block", "block", "none"] }}>
      <StudentsList />
    </Box>
  )
}

export default PageHome
