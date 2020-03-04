import queryString from "query-string"
import { useLocation } from "@reach/router"

export const useQueryString = (key: string): string => {
  const location = useLocation()
  const query = queryString.parse(location.search)

  let result: string
  if (Array.isArray(query?.[key])) {
    result = query?.[key]?.[0] ?? ""
  } else {
    result = (query?.[key] as string) ?? ""
  }
  return result
}
