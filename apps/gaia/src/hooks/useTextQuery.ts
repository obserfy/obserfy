import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import useDebounce from "$hooks/useDebounce"
import useSetQueries from "$hooks/useSetQueries"

const useTextQuery = (name: string, defaultValue: string = "") => {
  const router = useRouter()
  const setQueries = useSetQueries()

  const [value, setValue] = useState(defaultValue)
  const debounced = useDebounce(value, 250)

  const currentValue = router.query[name]

  useEffect(() => {
    if (currentValue !== debounced) {
      setQueries({ [name]: debounced })
    }
  }, [name, debounced, currentValue, setQueries])

  return [value, setValue] as const
}

export default useTextQuery
