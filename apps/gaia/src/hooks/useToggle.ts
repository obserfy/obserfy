import { useCallback, useState } from "react"

export default (initialValue = false) => {
  const [isOn, setIsOn] = useState(initialValue)
  const toggle = useCallback(() => {
    setIsOn((v) => !v)
  }, [])

  return { isOn, toggle }
}
