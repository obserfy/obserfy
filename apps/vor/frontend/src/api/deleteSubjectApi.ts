import { BASE_URL } from "./useApi"

export function deleteSubjectApi(subjectId: string): Promise<Response> {
  return fetch(`${BASE_URL}/curriculums/subjects/${subjectId}`, {
    credentials: "same-origin",
    method: "DELETE",
  })
}
