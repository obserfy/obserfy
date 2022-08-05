import { useQueryString } from "../../../../../hooks/useQueryString"
import PageEditStudentClass from "../../../../../components/PageEditStudentClass/PageEditStudentClass"

const EditClass = () => {
  const id = useQueryString("studentId")

  return <PageEditStudentClass studentId={id} />
}

export default EditClass
