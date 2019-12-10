export function setCrispEmail(email: string): void {
  $crisp.push(["set", "user:email", email])
}

export function setCrispNickName(nickname: string): void {
  $crisp.push(["set", "user:nickname", [nickname]])
}
