import React, { FC } from "react"
import { Box } from "theme-ui"
import StudentProgressSummaryCard from "./StudentProgressSummaryCard"

export default {
  title: "Basic/Card/StudentProgressSummaryCard",
  component: StudentProgressSummaryCard,
  parameters: {
    componentSubtitle: "Just a simple StudentProgressSummaryCard",
  },
}

export const Basic: FC = () => (
  <Box p={3}>
    <StudentProgressSummaryCard studentId="asdasdasd" />
  </Box>
)
