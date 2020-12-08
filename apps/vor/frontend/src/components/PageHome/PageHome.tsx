import React, { FC } from "react"
import { Box } from "theme-ui"
import StudentsList from "../StudentsList/StudentsList"

export const PageHome: FC = () => (
  <Box sx={{ display: ["block", "block", "none"] }}>
    <StudentsList />
  </Box>
)

export default PageHome
