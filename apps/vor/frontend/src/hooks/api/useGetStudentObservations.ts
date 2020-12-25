import { useQuery } from "react-query"
import { Dayjs } from "../../dayjs"
import { useQueryCache } from "../useQueryCache"
import { getApi } from "./fetchApi"

export interface Observation {
  id: string
  studentName: string
  shortDesc: string
  longDesc: string
  categoryId: string
  createdDate?: string
  creatorId?: string
  creatorName?: string
  eventTime?: string
  area?: {
    id: string
    name: string
  }
  images: Array<{
    id: string
    thumbnailUrl: string
    originalUrl: string
  }>
  visibleToGuardians: boolean
}

export const useGetStudentObservations = (
  studentId: string,
  search: string = "",
  startDate?: Dayjs,
  endDate?: Dayjs
) => {
  const getStudentObservations = getApi<Observation[]>(
    `/students/${studentId}/observations?search=${search}&startDate=${
      startDate?.toISOString() ?? ""
    }&endDate=${endDate?.toISOString() ?? ""}`
  )

  return useQuery(
    KEY(studentId, search, startDate, endDate),
    getStudentObservations
  )
}

export const useGetStudentObservationsCache = (studentId: string) => {
  return useQueryCache<Observation[]>(KEY(studentId))
}

const KEY = (
  studentId: string,
  search?: string,
  startDate?: Dayjs,
  endDate?: Dayjs
) => {
  const key = ["student", studentId, "observations"]
  if (search && search !== "") key.push(search)
  if (startDate) key.push(startDate.toISOString())
  if (endDate) key.push(endDate.toISOString())
  return key
}
