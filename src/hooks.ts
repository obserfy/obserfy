import { RefObject, useEffect } from "react"
import { useThemeUI } from "theme-ui"
import { Theme } from "./gatsby-plugin-theme-ui"

export const useOutsideClick = (
  ref: RefObject<HTMLElement>,
  callback: () => void
): void => {
  const handleClick: EventListener = e => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback()
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
    }
  })
}
export const useTheme = (): Theme => {
  const themeUi = useThemeUI()
  return themeUi.theme as Theme
}
