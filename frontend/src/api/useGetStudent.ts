import { navigate } from "gatsby"
import { QueryResult, useQuery } from "react-query"
import { BASE_URL } from "./useApi"

export interface Student {
  id: string
  name: string
  dateOfBirth: string
}
export const useGetStudent = (
  studentId: string
): QueryResult<Student, { studentId: string }> => {
  async function fetchStudent(): Promise<Student> {
    const url = `/students/${studentId}`
    const result = await fetch(`${BASE_URL}${url}`, {
      credentials: "same-origin",
    })

    if (result.status === 401) await navigate("/login")

    return result.json()
  }

  return useQuery(["student", { studentId }], fetchStudent)
}
