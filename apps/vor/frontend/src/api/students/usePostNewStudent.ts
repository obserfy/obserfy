import { MutationResultPair, useMutation } from "react-query"
import { getSchoolId } from "../../hooks/schoolIdState"
import { postApi } from "../fetchApi"
import { Dayjs } from "../../dayjs"

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
  dateOfBirth?: Dayjs
  dateOfEntry?: Dayjs
  customId: string
  classes: string[]
  note: string
  gender: number
  profileImageId: string
  guardians: Array<{
    id: string
    relationship: GuardianRelationship
  }>
}

export const usePostNewStudent = (): MutationResultPair<
  Response,
  NewStudent,
  Error
> => {
  const postNewStudent = postApi<NewStudent>(
    `/schools/${getSchoolId()}/students`
  )
  return useMutation(postNewStudent)
}
