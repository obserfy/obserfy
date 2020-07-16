/** @deprecated use the new react-query based hook, create one if it does not exists */
export function mailPasswordResetApi(email: string): Promise<Response> {
  return fetch(`/auth/mailPasswordReset`, {
    credentials: "same-origin",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
}
