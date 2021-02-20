export const isEmpty = (array?: any[]) => (array?.length ?? 0) === 0

interface OrderedObject {
  order: number
}
export const compareOrder = (a: OrderedObject, b: OrderedObject) => {
  return a.order - b.order
}
