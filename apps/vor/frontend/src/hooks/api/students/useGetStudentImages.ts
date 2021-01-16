import { useQuery } from "react-query"
import { getApi } from "../fetchApi"

export interface StudentImage {
  id: string
  originalUrl: string
  thumbnailUrl: string
  createdAt: string
}
const useGetStudentImages = (studentId: string) => {
  const getStudentImages = getApi<StudentImage[]>(
    `/students/${studentId}/images`
  )
  return useQuery(["student", studentId, "images"], getStudentImages)
}

export default useGetStudentImages
