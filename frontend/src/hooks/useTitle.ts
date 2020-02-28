import { useContext, useEffect } from "react"
import { PageTitleContext } from "../layouts"

export function useTitle(title: string): void {
  const pageTitle = useContext(PageTitleContext)
  useEffect(() => {
    pageTitle.setTitle(title)
  }, [title])
}
