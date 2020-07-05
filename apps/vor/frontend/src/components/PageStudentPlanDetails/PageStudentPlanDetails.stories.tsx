import React, { FC } from "react"
import PageStudentPlanDetails from "./PageStudentPlanDetails"

export default {
  title: "Core|PageStudentPlanDetails",
  component: PageStudentPlanDetails,
  parameters: {
    componentSubtitle: "Just a simple PageStudentPlanDetails",
  },
}

export const Basic: FC = () => (
  <PageStudentPlanDetails planId="asfddsafdsadf" studentId="asdfasfd" />
)
