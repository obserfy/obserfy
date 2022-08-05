import { FC } from "react"
import PageNewStudentPlans from "./PageNewStudentPlans"

export default {
  title: "Core/PageNewStudentPlans",
  component: PageNewStudentPlans,
  parameters: {
    componentSubtitle: "Just a simple PageNewStudentPlans",
  },
}

export const Basic: FC = () => (
  <PageNewStudentPlans
    chosenDate={new Date(1996, 4, 26).toISOString()}
    studentId="adsfasdfsa"
  />
)
