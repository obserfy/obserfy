import { useEffect, useState } from "react"
import { navigate } from "gatsby"

const baseUrl = "/api/v1"

function useApi<T>(url: string): any {
  const [response, setResponse] = useState<T | undefined>()

  useEffect(() => {
    async function f(): Promise<void> {
      const result = await fetch(`${baseUrl}${url}`, {
        credentials: "same-origin",
      })
      if (result.status === 401) {
        // throw new UnauthorizedError()
        navigate("/login")
      }
      const data = await result.json()
      setResponse(data)
    }
    f()
  }, [url])

  return response
}

export interface Student {
  id: string
  name: string
}
export const useStudentNames = (): [Student[], (name: string) => void] => {
  const names = useApi<Student>("/students")

  return [names ?? [], () => {}]
}
