export function deleteStudentApi(studentId: string): Promise<Response> {
  const baseUrl = "/api/v1"

  return fetch(`${baseUrl}/students/${studentId}`, {
    credentials: "same-origin",
    method: "DELETE",
  })
}
