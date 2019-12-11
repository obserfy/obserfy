export function setCrispEmail(email: string): void {
  $crisp.push(["set", "user:email", email])
}

export function setCrispNickName(nickname: string): void {
  $crisp.push(["set", "user:nickname", [nickname]])
}

export function setCrispCompanyName(name: string): void {
  $crisp.push(["set", "user:company", [name]])
}

export function resetCrispSession(): void {
  $crisp.push(["do", "session:reset"])
}

export function setCrispToken(id: string): void {
  window.CRISP_TOKEN_ID = id
  if (!Array.isArray($crisp)) {
    resetCrispSession()
  }
}
