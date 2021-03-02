export const isEmpty = (array?: any[]) => (array?.length ?? 0) === 0

interface OrderedObject {
  order: number
}
export const compareOrder = (a: OrderedObject, b: OrderedObject) => {
  return a.order - b.order
}

export const range = (length: number) => {
  const array: number[] = []
  for (let i = 0; i < length; i += 1) {
    array.push(i)
  }
  return array
}
