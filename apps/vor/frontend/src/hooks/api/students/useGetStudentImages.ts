import { useQuery } from "react-query"
import { getApi } from "../fetchApi"

interface Images {
  id: string
  originalUrl: string
  thumbnailUrl: string
  createdAt: string
}
const useGetStudentImages = (studentId: string) => {
  const getStudentImages = getApi<Images[]>(`/students/${studentId}/images`)
  return useQuery(["student", studentId, "images"], getStudentImages)
}

export default useGetStudentImages
