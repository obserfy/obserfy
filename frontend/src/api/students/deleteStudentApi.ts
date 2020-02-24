import { BASE_URL } from "../useApi"
import { getSchoolId } from "../../hooks/schoolIdState"
import { deleteStudentFromCache } from "./studentCache"

export async function deleteStudentApi(studentId: string): Promise<Response> {
  const response = await fetch(`${BASE_URL}/students/${studentId}`, {
    credentials: "same-origin",
    method: "DELETE",
  })
  if (response.status === 200) {
    await deleteStudentFromCache(getSchoolId(), studentId)
  }
  return response
}
