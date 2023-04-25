// experiment with fully relying on imgproxy.
export default function imgproxyLoader({ src, width, quality }) {
  const baseUrl = process.env.NEXT_PUBLIC_IMGPROXY_URL

  const params = [`w:${width}`]
  if (quality) {
    params.push(`q:${quality}`)
  }

  const paramsString = params.join("/")
  return `${baseUrl}/02jnc498jjkfn984jk83rnc20njfh38932/${paramsString}/${normalizeSrc(
    src
  )}`
}

const normalizeSrc = (src) => {
  return src.startsWith("/") ? src.slice(1) : src
}
