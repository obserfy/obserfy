import { useEffect, useState } from "react"

const useDetectVirtualKeyboard = () => {
  const [keyboardShown, setKeyboardShown] = useState(false)
  const [lastVh, setLastVh] = useState(0)

  // Hide navbar when keyboard is shown.
  useEffect(() => {
    const listener: EventListener = () => {
      const vh = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      )
      if (vh === lastVh) return
      if (vh < 400) {
        setKeyboardShown(true)
        setLastVh(vh)
      } else {
        setKeyboardShown(false)
        setLastVh(vh)
      }
    }
    window.addEventListener("resize", listener)
    return () => {
      window.removeEventListener("resize", listener)
    }
  }, [lastVh])

  return keyboardShown
}

export default useDetectVirtualKeyboard
