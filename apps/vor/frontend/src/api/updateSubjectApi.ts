import { BASE_URL } from "./useApi"
import { Material } from "./useGetSubjectMaterials"

interface UpdateSubjectPayload {
  id: string
  name: string
  areaId: string
  order: number
  materials: Material[]
}
export function updateSubjectApi(
  subject: UpdateSubjectPayload
): Promise<Response> {
  return fetch(`${BASE_URL}/curriculums/subjects/${subject.id}`, {
    credentials: "same-origin",
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subject),
  })
}
