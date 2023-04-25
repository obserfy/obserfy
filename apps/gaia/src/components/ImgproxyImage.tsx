import getConfig from "next/config"
import Image, { ImageLoader, ImageProps } from "next/image"
import { FC } from "react"

const normalizeSrc = (src: string) => {
  return src.startsWith("/") ? src.slice(1) : src
}

const imgproxyLoader: ImageLoader = ({ src, width, quality }) => {
  const params = [`w:${width}`]
  if (quality) {
    params.push(`q:${quality}`)
  }

  const paramsString = params.join("/")
  return `${
    process.env.NEXT_PUBLIC_IMGPROXY_URL
  }/02jnc498jjkfn984jk83rnc20njfh38932/${paramsString}/${normalizeSrc(src)}`
}

const ImgproxyImage: FC<ImageProps> = (props) => {
  return <Image {...props} loader={imgproxyLoader} />
}

export default ImgproxyImage
