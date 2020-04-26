import { useEffect, useMemo, useRef } from "react"
import { get, set } from "idb-keyval"
import { NewStudentFormData } from "./PageNewStudent"
import dayjs from "../../dayjs"

const CACHE_KEY = "newStudentFormCache"

export const setNewStudentCache = async (
  data: NewStudentFormData,
  picture?: File
) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  await set(CACHE_KEY, picture)
}

export const useCacheNewStudentFormData = (
  data: NewStudentFormData,
  picture?: File
): void => {
  const isMounted = useRef(false)

  useEffect(() => {
    let isCancelled = false
    const runAsync = async () => {
      console.log(data)
      if (isMounted.current && !isCancelled) {
        await set(CACHE_KEY, picture)
        localStorage.setItem(CACHE_KEY, JSON.stringify(data))
      } else {
        isMounted.current = true
      }
    }
    runAsync()
    return () => {
      isCancelled = true
    }
  }, [
    picture,
    data.dateOfEntry,
    data.dateOfBirth,
    data.selectedClasses,
    data.guardians,
    data.gender,
    data.note,
    data.customId,
    data.name,
  ])
}

export const useGetNewStudentFormCache = (
  defaultValue: NewStudentFormData,
  pictureCallback: (file: File) => void
): NewStudentFormData => {
  // Load the image asynchronously
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

  // Load everything else in sync
  return useMemo((): NewStudentFormData => {
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
}
