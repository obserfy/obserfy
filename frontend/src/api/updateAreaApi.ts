import { BASE_URL } from "./useApi"

export function updateAreaApi(areaId: string, name: string): Promise<Response> {
  return fetch(`${BASE_URL}/curriculum/areas/${areaId}`, {
    credentials: "same-origin",
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  })
}
