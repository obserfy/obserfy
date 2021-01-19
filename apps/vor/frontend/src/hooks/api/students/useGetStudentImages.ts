import { useQuery } from "react-query"
import { useQueryCache } from "../../useQueryCache"
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

export const useGetStudentImagesCache = (studentId: string) => {
  return useQueryCache<StudentImage[]>(["student", studentId, "images"])
}
