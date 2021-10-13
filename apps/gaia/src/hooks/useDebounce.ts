import { useEffect, useState } from "react"

const useDebounce = <P>(value: P, duration: number): P => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(value)
    }, duration)

    return () => {
      clearTimeout(timeout)
    }
  }, [value])

  return debounced
}

export default useDebounce
