export function resetPasswordApi(email: string): Promise<Response> {
  return fetch(`/auth/reset-password`, {
    credentials: "same-origin",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
}
