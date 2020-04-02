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
  gender: number
  guardians: Array<{
    name: string
    email: string
    phone: string
    note: string
    relationship: GuardianRelationship
  }>
}

export const usePostNewStudent = (): [
  MutateFunction<Response, { student: NewStudent; picture?: File }>,
  MutationResult<Response>
] => {
  const postNewStudent = async (data: {
    student: NewStudent
    picture: File
  }): Promise<Response> => {
    const studentJson = JSON.stringify(data.student)
    const payload = new FormData()
    payload.append(
      "student",
      new Blob([studentJson], {
        type: "application/json",
      })
    )
    if (data.picture) {
      payload.append("picture", data.picture)
    }

    const result = await fetch(
      `${BASE_URL}/schools/${getSchoolId()}/students`,
      {
        credentials: "same-origin",
        method: "POST",
        body: payload,
      }
    )
    getAnalytics()?.track("Student Created", {
      responseStatus: result.status,
      studentName: data.student.name,
    })
    return result
  }

  return useMutation(postNewStudent)
}
