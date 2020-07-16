interface RequestBody {
  stage: number
}
/** @deprecated use the new react-query based hook, create one if it does not exists */
export function updateStudentMaterialProgress(
  studentId: string,
  materialId: string,
  body: RequestBody
): Promise<Response> {
  const baseUrl = "/api/v1"

  return fetch(
    `${baseUrl}/students/${studentId}/materialsProgress/${materialId}`,
    {
      credentials: "same-origin",
      method: "PATCH",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }
  )
}
