import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock"
import { useLayoutEffect, useRef } from "react"

const useBodyScrollLock = () => {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (ref.current) {
      disableBodyScroll(ref.current, {
        reserveScrollBarGap: true,
        allowTouchMove: (el) => el.tagName === "TEXTAREA",
      })
    }
    return () => {
      if (ref.current) enableBodyScroll(ref.current)
    }
  }, [])

  return ref
}

export default useBodyScrollLock
