import { useQueryString } from "../../../../hooks/useQueryString"
import PageStudentImageDetails from "../../../../components/PageStudentImageDetails/PageStudentImageDetails"

const Image = () => {
  const studentId = useQueryString("studentId")
  const imageId = useQueryString("imageId")

  return <PageStudentImageDetails studentId={studentId} imageId={imageId} />
}

export default Image
