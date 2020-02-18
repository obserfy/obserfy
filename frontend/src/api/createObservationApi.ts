import { BASE_URL } from "./useApi"
import { Observation } from "./useGetObservations"

export function createObservationApi(
  studentId: string,
  observation: Observation
): Promise<Response> {
  return fetch(`${BASE_URL}/students/${studentId}/observations`, {
    credentials: "same-origin",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(observation),
  })
}
