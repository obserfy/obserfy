import { useEffect, useMemo, useRef } from "react"
import { get, set } from "idb-keyval"
import { NewStudentFormData } from "./PageNewStudent"

const CACHE_KEY = "newStudentFormCache"

export const useCacheNewStudentFormData = (
  data: NewStudentFormData,
  picture?: File
): void => {
  const isMounted = useRef(false)

  useEffect(() => {
    if (isMounted.current) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data))
      set(CACHE_KEY, picture)
    } else {
      isMounted.current = true
    }
  }, [picture, data])
}

export const useGetNewStudentFormCache = (
  defaultValue: NewStudentFormData,
  pictureCallback: (file: File) => void
): NewStudentFormData => {
  useEffect(() => {
    let isCancelled = false
    const loadPicture = async (): Promise<void> => {
      const cachedPicture = await get<File>(CACHE_KEY)
      if (!isCancelled) {
        pictureCallback(cachedPicture)
      }
    }
    loadPicture()
    return () => {
      isCancelled = true
    }
  }, [pictureCallback])

  return useMemo((): NewStudentFormData => {
    const cachedData =
      typeof localStorage !== "undefined" && localStorage.getItem(CACHE_KEY)
    if (cachedData) {
      return JSON.parse(cachedData)
    }
    return defaultValue
  }, [defaultValue])
}
