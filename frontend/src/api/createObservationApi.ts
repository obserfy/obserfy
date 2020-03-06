import { BASE_URL } from "./useApi"

interface CreateObservationPayload {
  categoryId: string
  longDesc: string
  shortDesc: string
}
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
