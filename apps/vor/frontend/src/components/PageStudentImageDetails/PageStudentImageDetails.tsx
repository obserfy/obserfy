import React, { FC } from "react"
import { Box } from "theme-ui"
import BackNavigation from "../BackNavigation/BackNavigation"
import { STUDENT_IMAGES_URL } from "../../routes"

interface Props {
  studentId: string
  imageId: string
}
export const PageStudentImageDetails: FC<Props> = ({ studentId }) => (
  <Box>
    <BackNavigation to={STUDENT_IMAGES_URL(studentId)} text="Image Gallery" />
  </Box>
)

export default PageStudentImageDetails
