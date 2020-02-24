import { get, set } from "idb-keyval"
import { useEffect, useState } from "react"
import { Student } from "./useGetStudents"

const CACHE_VERSION = 1

const createCacheKey = (): string => `${CACHE_VERSION}:/schools/students`

// This is the shape of data we save on cache
interface StudentCache {
  id: string
  name: string
  schoolId: string
}
export function useStudentsCache(
  schoolId: string,
  data?: Student[]
): StudentCache[] {
  const [students, setStudents] = useState<StudentCache[]>([])
  const key = createCacheKey()
  const dataWithSchoolId = data?.map(student => ({ ...student, schoolId }))

  // Get cache content just once
  useEffect(() => {
    let cancelled = false
    get<StudentCache[]>(key).then(cachedData => {
      if (cachedData?.length > 0 && !cancelled) {
        setStudents(
          cachedData.filter(cache => {
            return cache.schoolId === schoolId
          })
        )
      }
    })
    return () => {
      cancelled = true
    }
  }, [key, schoolId])

  // TODO: This currently overwrites the whole cache whenever user changes schoolId
  //  revamp later
  // Update cached content
  useEffect(() => {
    let cancelled = false
    if (dataWithSchoolId !== undefined) {
      set(key, dataWithSchoolId).then(() => {
        if (!cancelled) {
          setStudents(dataWithSchoolId ?? [])
        }
      })
    }
    return () => {
      cancelled = true
    }
  }, [key, dataWithSchoolId, schoolId])

  return students
}

export async function deleteStudentFromCache(
  schoolId: string,
  studentId: string
): Promise<void> {
  const key = createCacheKey()
  const students = await get<Student[]>(key)
  await set(
    key,
    students.filter(({ id }) => id !== studentId)
  )
}
