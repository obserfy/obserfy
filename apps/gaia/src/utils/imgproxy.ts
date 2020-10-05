import { createHmac } from "crypto"

const KEY = process.env.IMGPROXY_KEY
const SALT = process.env.IMGPROXY_SALT
const URL = process.env.IMGPROXY_URL
const BUCKET = process.env.IMGPROXY_BUCKET

if (!KEY || !SALT || !URL || !BUCKET) throw new Error("Incomplete imgproxy env")

export const generateUrl = (
  imagePath: string,
  width: number,
  height: number
) => {
  const urlSafeBase64 = (string: Buffer | string) => {
    return Buffer.from(string)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
  }

  const hexDecode = (hex: string) => Buffer.from(hex, "hex")

  const sign = (salt: string, target: string, secret: string) => {
    const hmac = createHmac("sha256", hexDecode(secret))
    hmac.update(hexDecode(salt))
    hmac.update(target)
    return urlSafeBase64(hmac.digest())
  }

  const url = `s3://${BUCKET}/${imagePath}`
  const resizingType = "fill"
  const gravity = "no"
  const enlarge = 1
  const encodedUrl = urlSafeBase64(url)
  const path = `/${resizingType}/${width}/${height}/${gravity}/${enlarge}/${encodedUrl}`

  const signature = sign(SALT, path, KEY)
  return `${URL}/${signature}${path}`
}
