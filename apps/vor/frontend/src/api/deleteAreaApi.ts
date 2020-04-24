import { BASE_URL } from "./useApi"

export function deleteAreaApi(areaId: string): Promise<Response> {
  return fetch(`${BASE_URL}/curriculum/areas/${areaId}`, {
    credentials: "same-origin",
    method: "DELETE",
  })
}
