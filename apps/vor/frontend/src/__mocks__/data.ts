import { FixedObject, FluidObject } from "gatsby-image"
// eslint-disable-next-line import/no-extraneous-dependencies
import faker from "faker"

export function generateFluidObject(url?: string): FluidObject {
  const imageUrl =
    url == null ? faker.image.imageUrl(500, 500, "people", false, true) : url
  return {
    aspectRatio: 1,
    srcSetWebp: imageUrl,
    src: imageUrl,
    srcSet: imageUrl,
    sizes: "",
  }
}

export function generateFixedObject(
  width: number,
  height: number,
  url?: string
): FixedObject {
  const imageUrl =
    url == null
      ? faker.image.imageUrl(width, height, "people", false, true)
      : url
  return {
    srcSetWebp: imageUrl,
    src: imageUrl,
    srcSet: imageUrl,
    width,
    height,
  }
}
