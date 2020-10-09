import * as Minio from "minio"

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT ?? "localhost",
  port: process.env.MINIO_PORT
    ? parseInt(process.env.MINIO_PORT, 10)
    : undefined,
  useSSL: process.env.NODE_ENV === "production",
  accessKey: process.env.MINIO_ACCESS_KEY ?? "",
  secretKey: process.env.MINIO_SECRET_KEY ?? "",
})
const uploadFile = async (key: string, file: Buffer) => {
  await minioClient.putObject(process.env.MINIO_BUCKET_NAME ?? "", key, file)
}
export default uploadFile
