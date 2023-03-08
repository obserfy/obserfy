import { findRelatedStudents, findStudentByStudentId } from "$lib/db"
import { cache } from "react"
import { generateOriginalUrl } from "../utils/imgproxy"

export const getGuardianStudents = cache(async (email: string) => {
  const students = await findRelatedStudents(email)

  return students?.map((student) => ({
    ...student,
    profilePic: student.images?.object_key
      ? generateOriginalUrl(student.images.object_key)
      : null,
  }))
})

export const getStudentsById = cache((id: string) => {
  return findStudentByStudentId(id)
})
