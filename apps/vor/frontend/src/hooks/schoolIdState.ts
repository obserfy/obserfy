const key = "SCHOOL_ID"
export function setSchoolIdState(id: string): void {
  if (typeof window !== "undefined") localStorage.setItem(key, id)
}

export const SCHOOL_ID_UNDEFINED_PLACEHOLDER = "emptyschoolid"

// TODO: see if this localstorage access causes bottlenecks, its called many times
export function getSchoolId(): string {
  // required to prevent special things that happens when school
  // id is empty from happening on test and gatsby build.
  // TODO: Maybe there is a better way to detect whether school id is saved in local storage or not
  return typeof window !== "undefined"
    ? localStorage.getItem(key) ?? SCHOOL_ID_UNDEFINED_PLACEHOLDER
    : "NO_WINDOW"
}
