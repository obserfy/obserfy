export interface NewStudent {
  name: string
  dateOfBirth?: Date
}
export function createStudentApi(
  schoolId: string,
  student: NewStudent
): Promise<Response> {
  const baseUrl = "/api/v1"

  return fetch(`${baseUrl}/schools/${schoolId}/students`, {
    credentials: "same-origin",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  })
}
