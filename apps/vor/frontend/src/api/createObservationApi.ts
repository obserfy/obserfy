import { BASE_URL } from "./useApi"

interface CreateObservationPayload {
  categoryId: string
  longDesc: string
  shortDesc: string
}
/** @deprecated use the new react-query based hook, create one if it does not exists */
export function createObservationApi(
  studentId: string,
  observation: CreateObservationPayload
): Promise<Response> {
  return fetch(`${BASE_URL}/students/${studentId}/observations`, {
    credentials: "same-origin",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(observation),
  })
}
