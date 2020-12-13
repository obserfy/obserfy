import { BASE_URL } from "./useApi"

export interface NewSubject {
  name: string
  materials: Array<{
    name: string
    order: number
  }>
}
/** @deprecated use the new react-query based hook, create one if it does not exists */
export function createSubjectApi(
  areaId: string,
  subject: NewSubject
): Promise<Response> {
  return fetch(`${BASE_URL}/curriculums/areas/${areaId}/subjects`, {
    credentials: "same-origin",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subject),
  })
}
