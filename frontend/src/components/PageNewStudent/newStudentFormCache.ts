import { get, set } from "idb-keyval"
import { useEffect, useRef } from "react"
import { NewStudentFormData } from "./PageNewStudent"

const CACHE_KEY = "newStudentFormCache"

export const useCacheNewStudentFormData = (data: NewStudentFormData): void => {
  const isMounted = useRef(false)

  useEffect(() => {
    if (isMounted.current) {
      set(CACHE_KEY, data)
    } else {
      isMounted.current = true
    }
  }, [data])
}

export const useGetNewStudentFormCache = (
  updateStateCallback: (data: NewStudentFormData) => void
): void => {
  useEffect(() => {
    const getCache = async (): Promise<void> => {
      const cache = await get<NewStudentFormData>(CACHE_KEY)
      if (cache !== undefined) {
        updateStateCallback(cache)
      }
    }
    getCache()
  }, [updateStateCallback])
}
