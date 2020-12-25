import { useEffect, useState } from "react"

const useDebounce = <T>(value: T, delay: number = 100): T => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(timeout)
    }
  })

  return debouncedValue
}

export default useDebounce
