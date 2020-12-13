import { BASE_URL } from "./useApi"

/** @deprecated use the new react-query based hook, create one if it does not exists */
export function updateAreaApi(areaId: string, name: string): Promise<Response> {
  return fetch(`${BASE_URL}/curriculums/areas/${areaId}`, {
    credentials: "same-origin",
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  })
}
