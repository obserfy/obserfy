import { QueryResult, useQuery } from "react-query"
import { navigate } from "../components/Link/Link"
import { BASE_URL } from "./useApi"

export interface Student {
  id: string
  name: string
  dateOfBirth: string
  dateOfEntry: string
  gender: number
  not: string
  customId: string
  active: boolean
  profilePic: string
  classes: Array<{
    id: string
    name: string
  }>
  guardians: Array<{
    id: string
    name: string
    relationship: number
    email: string
  }>
}
export const useGetStudent = (studentId: string): QueryResult<Student> => {
  async function fetchStudent(): Promise<Student> {
    const url = `/students/${studentId}`
    const result = await fetch(`${BASE_URL}${url}`, {
      credentials: "same-origin",
    })

    if (result.status === 401) await navigate("/login")

    return result.json()
  }

  return useQuery(["student", studentId], fetchStudent)
}
