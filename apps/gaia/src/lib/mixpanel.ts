import { useEffect } from "react"

export const track = (value: string) => {
  if (typeof mixpanel !== "undefined") {
    mixpanel.track(value)
  }
}

export const useTrack = (value: string) => {
  useEffect(() => {
    track(value)
  }, [value])
}
