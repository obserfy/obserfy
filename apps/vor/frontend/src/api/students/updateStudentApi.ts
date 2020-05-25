interface UpdateStudentRequestBody {
  id: string
  name?: string
  customId?: string
  dateOfBirth?: Date
  dateOfEntry?: Date
  gender?: number
}
export function updateStudentApi(
  student: UpdateStudentRequestBody
): Promise<Response> {
  const baseUrl = "/api/v1"

  return fetch(`${baseUrl}/students/${student.id}`, {
    credentials: "same-origin",
    method: "PUT",
    body: JSON.stringify(student),
    headers: { "Content-Type": "application/json" },
  })
}
