import { BASE_URL } from "./useApi"

/** @deprecated use the new react-query based hook, create one if it does not exists */
export function createAreaApi(
  name: string,
  curriculumId: string
): Promise<Response> {
  return fetch(`${BASE_URL}/curriculums/${curriculumId}/areas`, {
    credentials: "same-origin",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  })
}
