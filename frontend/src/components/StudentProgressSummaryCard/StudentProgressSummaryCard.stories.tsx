import React, { FC } from "react"
import StudentProgressSummaryCard from "./StudentProgressSummaryCard"
import Box from "../Box/Box"

export default {
  title: "Core|StudentProgressSummaryCard",
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
