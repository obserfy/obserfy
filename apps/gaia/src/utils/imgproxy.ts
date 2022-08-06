import { createHmac } from "crypto"

const KEY = process.env.IMGPROXY_KEY ?? ""
const SALT = process.env.IMGPROXY_SALT ?? ""
const URL = process.env.IMGPROXY_URL ?? ""
const BUCKET = process.env.IMGPROXY_BUCKET ?? ""

const hexDecode = (hex: string) => Buffer.from(hex, "hex")

const urlSafeBase64 = (string: Buffer | string) => {
  return Buffer.from(string)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

const sign = (salt: string, target: string, secret: string) => {
  const hmac = createHmac("sha256", hexDecode(secret))
  hmac.update(hexDecode(salt))
  hmac.update(target)
  return urlSafeBase64(hmac.digest())
}

export const generateUrl = (
  objectKey: string,
  width: number,
  height: number
) => {
  const url = `s3://${BUCKET}/${objectKey}`
  const resizingType = "fill"
  const enlarge = 1
  const encodedUrl = urlSafeBase64(url)
  const path = `/rs:${resizingType}/w:${width}/h:${height}/el:${enlarge}/${encodedUrl}.jpg`

  const signature = sign(SALT, path, KEY)
  return `${URL}/${signature}${path}`
}

export const generateOriginalUrl = (objectKey: string) => {
  const url = `s3://${BUCKET}/${objectKey}`

  const path = `/${urlSafeBase64(url)}`
  const signature = sign(SALT, path, KEY)

  return `${URL}/${signature}${path}`
}
