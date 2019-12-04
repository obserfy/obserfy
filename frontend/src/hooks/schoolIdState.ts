const key = "SCHOOL_ID"
export function setSchoolIdState(id: string): void {
  localStorage.setItem(key, id)
}

export function getSchoolId(): string {
  return localStorage.getItem(key) ?? "n/a"
}
