import { BASE_URL } from "./useApi"

/** @deprecated use the new react-query based hook, create one if it does not exists */
export function deleteAreaApi(areaId: string): Promise<Response> {
  return fetch(`${BASE_URL}/curriculums/areas/${areaId}`, {
    credentials: "same-origin",
    method: "DELETE",
  })
}
