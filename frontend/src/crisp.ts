export function setCrispEmail(email: string): void {
  if (typeof $crisp !== "undefined") $crisp?.push(["set", "user:email", email])
}

export function setCrispNickName(nickname: string): void {
  if (typeof $crisp !== "undefined")
    $crisp?.push(["set", "user:nickname", [nickname]])
}

export function setCrispCompanyName(name: string): void {
  if (typeof $crisp !== "undefined")
    $crisp?.push(["set", "user:company", [name]])
}

export function resetCrispSession(): void {
  if (typeof $crisp !== "undefined") $crisp?.push(["do", "session:reset"])
}

export function setCrispToken(id: string): void {
  window.CRISP_TOKEN_ID = id
  if (typeof $crisp !== "undefined" && !Array.isArray($crisp)) {
    resetCrispSession()
  }
}
