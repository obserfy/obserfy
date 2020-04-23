export function addOnlyUniqueValues<T>(currentValues: T[], newValue: T): T[] {
  if (!currentValues.includes(newValue)) {
    currentValues.push(newValue)
  }
  return currentValues
}
