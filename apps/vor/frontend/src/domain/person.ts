interface Person {
  name?: string
}

export const getFirstName = (person?: Person) => {
  return person?.name?.split(" ")[0] ?? ""
}
