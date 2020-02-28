export function doPasswordResetApi(
  token: string,
  password: string
): Promise<Response> {
  return fetch(`/auth/doPasswordReset`, {
    credentials: "same-origin",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  })
}
