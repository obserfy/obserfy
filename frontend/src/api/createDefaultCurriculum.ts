import { getSchoolId } from "../hooks/schoolIdState"
import { getAnalytics } from "../analytics"

export async function createDefaultCurriculum(
  onSuccess: () => void
): Promise<void> {
  const baseUrl = "/api/v1"
  const response = await fetch(
    `${baseUrl}/schools/${getSchoolId()}/curriculum`,
    {
      credentials: "same-origin",
      method: "POST",
    }
  )
  if (response.status === 201) {
    onSuccess()
    getAnalytics()?.track("Default curriculum created", {
      responseStatus: response.status,
    })
  } else {
    getAnalytics()?.track("Create curriculum failed", response.text())
  }
}
