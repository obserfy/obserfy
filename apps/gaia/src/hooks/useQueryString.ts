import { useRouter } from "next/router"

export const useQueryString = (key: string): string => {
  const router = useRouter()

  let result: string
  if (Array.isArray(router.query?.[key])) {
    result = router.query?.[key]?.[0] ?? ""
  } else {
    result = (router.query?.[key] as string) ?? ""
  }
  return result
}
