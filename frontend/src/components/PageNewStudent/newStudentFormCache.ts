import { useEffect, useMemo, useRef } from "react"
import { NewStudentFormData } from "./PageNewStudent"

const CACHE_KEY = "newStudentFormCache"

export const useCacheNewStudentFormData = (data: NewStudentFormData): void => {
  const isMounted = useRef(false)

  useEffect(() => {
    if (isMounted.current) {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    } else {
      isMounted.current = true
    }
  }, [data])
}

export const useGetNewStudentFormCache = (
  defaultValue: NewStudentFormData
): NewStudentFormData => {
  return useMemo((): NewStudentFormData => {
    const cachedData = window.localStorage.getItem(CACHE_KEY)
    if (cachedData) {
      return JSON.parse(cachedData)
    }
    return defaultValue
  }, [defaultValue])
}
