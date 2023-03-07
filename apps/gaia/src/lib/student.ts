import { findRelatedStudents, findStudentByStudentId } from "$lib/db"
import { cache } from "react"

export const getGuardianStudents = cache((email: string) => {
  return findRelatedStudents(email)
})

export const getStudentsById = cache((id: string) => {
  return findStudentByStudentId(id)
})
