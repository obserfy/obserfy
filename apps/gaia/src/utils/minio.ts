import * as Minio from "minio"

const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY ?? "",
  secretKey: process.env.MINIO_SECRET_KEY ?? "",
})
const uploadFile = async (key: string, file: Buffer) => {
  await minioClient.putObject(process.env.MINIO_BUCKET_NAME ?? "", key, file)
}
export default uploadFile
