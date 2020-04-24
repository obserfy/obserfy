import { BASE_URL } from "../useApi"

export function deleteStudentApi(studentId: string): Promise<Response> {
  return fetch(`${BASE_URL}/students/${studentId}`, {
    credentials: "same-origin",
    method: "DELETE",
  })
}
