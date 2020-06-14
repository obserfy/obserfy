import React, { FC } from "react"
import { BackNavigation } from "../BackNavigation/BackNavigation"
import { STUDENT_PROFILE_URL } from "../../routes"

interface Props {
  studentId: string
}
export const PageEditStudentClass: FC<Props> = ({ studentId }) => (
  <div>
    <BackNavigation
      text="Student Profile"
      to={STUDENT_PROFILE_URL(studentId)}
    />
  </div>
)

export default PageEditStudentClass
