import { QueryState, useQuery } from "react-query"
import { navigate } from "gatsby"
import { BASE_URL } from "../useApi"
import { getSchoolId } from "../../hooks/schoolIdState"

export interface Student {
  id: string
  name: string
}

async function fetchStudents(): Promise<Student[]> {
  const url = `/schools/${getSchoolId()}/students`
  const result = await fetch(`${BASE_URL}${url}`, {
    credentials: "same-origin",
  })

  // Throw user to login when something gets 401
  if (result.status === 401) {
    await navigate("/login")
    return []
  }

  return result.json()
}

export const useGetStudents = (): QueryState<Student[]> => {
  return useQuery("students", fetchStudents)
}
