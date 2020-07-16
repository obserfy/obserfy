import { useEffect, useMemo, useRef } from "react"
import { NewStudentFormData } from "./PageNewStudent"
import dayjs from "../../dayjs"

const CACHE_KEY = "newStudentFormCache"

export const setNewStudentCache = async (data: NewStudentFormData) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data))
}

// cache student form to local storage
export const useCacheNewStudentFormData = (data: NewStudentFormData): void => {
  const isMounted = useRef(false)

  useEffect(() => {
    const runAsync = async () => {
      if (isMounted.current) {
        await setNewStudentCache(data)
      } else {
        isMounted.current = true
      }
    }
    // debounce caching
    const timeout = setTimeout(runAsync, 100)
    return () => clearTimeout(timeout)
  }, [
    data.dateOfEntry,
    data.dateOfBirth,
    data.selectedClasses,
    data.guardians,
    data.gender,
    data.note,
    data.customId,
    data.name,
    data.profileImageId,
  ])
}

export const useGetNewStudentFormCache = (
  defaultValue: NewStudentFormData
): NewStudentFormData =>
  useMemo((): NewStudentFormData => {
    const cachedData =
      typeof localStorage !== "undefined" && localStorage.getItem(CACHE_KEY)
    if (cachedData) {
      const parsedData = JSON.parse(cachedData)
      return {
        ...parsedData,
        dateOfEntry: parsedData.dateOfEntry
          ? dayjs(parsedData.dateOfEntry).toDate()
          : undefined,
        dateOfBirth: parsedData.dateOfBirth
          ? dayjs(parsedData.dateOfBirth).toDate()
          : undefined,
      }
    }
    return defaultValue
  }, [defaultValue])
