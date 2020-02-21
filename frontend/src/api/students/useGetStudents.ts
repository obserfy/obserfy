import { useEffect, useState } from "react"
import { get, set } from "idb-keyval"
import useApi, { Api } from "../useApi"

export interface Student {
  id: string
  name: string
}
export const useGetStudents = (schoolId: string): Api<Student[]> => {
  const url = `/schools/${schoolId}/students`
  const [cachedStudents, setCachedStudents] = useState<Student[]>([])
  const api = useApi<Student[]>(url)

  useEffect(() => {
    const getCache = async (): Promise<void> => {
      const cachedData = await get<Student[]>(`${url}/1`)
      if (cachedData?.length > 0) {
        setCachedStudents(cachedData)
      }
    }
    getCache()
  }, [url])

  useEffect(() => {
    const updateCache = async (): Promise<void> => {
      if (api.data !== undefined) {
        await set(`${url}/1`, api)
        setCachedStudents(api.data)
      }
    }
    updateCache()
  }, [api, url])

  return { ...api, data: cachedStudents }
}
