import { get, set } from "idb-keyval"
import { useEffect, useState } from "react"
import { Student } from "./useGetStudents"

const CACHE_VERSION = 1

export function useStudentsCache(url: string, data?: Student[]): Student[] {
  const [students, setStudents] = useState<Student[]>([])

  // Get cache content just once
  useEffect(() => {
    get<Student[]>(`${CACHE_VERSION}:${url}`).then(cachedData => {
      if (cachedData?.length > 0) {
        setStudents(cachedData)
      }
    })
  }, [url])

  // Update cached content
  useEffect(() => {
    if (data === undefined) return
    set(`${CACHE_VERSION}:${url}`, data).then(() => {
      setStudents(data ?? [])
    })
  }, [data, url])

  return students
}
