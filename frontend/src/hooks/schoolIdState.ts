const key = "SCHOOL_ID"
export function setSchoolIdState(id: string): void {
  if (typeof window !== "undefined") localStorage.setItem(key, id)
}

export function getSchoolId(): string {
  return typeof window !== "undefined" ? localStorage.getItem(key) ?? "n/a" : ""
}
