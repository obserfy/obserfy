import useDebounce from "$hooks/useDebounce"
import useSetQueries from "$hooks/useSetQueries"
import { useEffect, useState } from "react"

const useTextQuery = (name: string, defaultValue: string = "") => {
  const setQueries = useSetQueries()

  const [value, setValue] = useState(defaultValue)
  const debounced = useDebounce(value, 250)

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    setQueries({ [name]: debounced })
  }, [debounced])

  return [value, setValue] as const
}

export default useTextQuery
