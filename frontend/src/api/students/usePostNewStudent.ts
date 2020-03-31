import { MutateFunction, MutationResult, useMutation } from "react-query"
import { BASE_URL } from "../useApi"
import { getSchoolId } from "../../hooks/schoolIdState"
import { getAnalytics } from "../../analytics"

export enum GuardianRelationship {
  Other,
  Mother,
  Father,
}

export enum Gender {
  NotSet,
  Male,
  Female,
}

interface NewStudent {
  name: string
  dateOfBirth?: Date
  dateOfEntry?: Date
  customId: string
  classes: string[]
  note: string
  guardians: Array<{
    name: string
    email: string
    phone: string
    note: string
    relationship: GuardianRelationship
  }>
}

export const usePostNewStudent = (): [
  MutateFunction<Response, NewStudent>,
  MutationResult<Response>
] => {
  const postNewStudent = async (newStudent: NewStudent): Promise<Response> => {
    const result = await fetch(
      `${BASE_URL}/schools/${getSchoolId()}/students`,
      {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      }
    )
    getAnalytics()?.track("Student Created", {
      responseStatus: result.status,
      studentName: newStudent.name,
    })
    return result
  }

  return useMutation(postNewStudent)
}
