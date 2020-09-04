import {NextApiRequest, NextApiResponse} from "next"
import * as Minio from "minio"
import auth0 from "../../../utils/auth0"
import {nanoid} from "nanoid"
import {insertImage} from '../../../db'

let minioClient;
(async function () {
    minioClient = new Minio.Client({
        endPoint: 'localhost',
        port:9000,
        // useSSL: true,
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY,
    })
    try {
        console.log('checking exissts')
        const exists = await minioClient.bucketExists(process.env.MINIO_BUCKET_NAME)
        console.log('exists',exists)
        if (!exists) {
            await minioClient.makeBucket(process.env.MINIO_BUCKET_NAME, process.env.MINIO_BUCKET_LOCATION)
        }
    } catch (err) {
        console.log('check bucket error',err)
    }
})()
const handlePost = async (
    res: NextApiResponse,
    req: NextApiRequest
) => {

    const schoolId = req.query.schoolId
    const studentId=req.query.studentId
    const key = "images/" + schoolId + "/" + nanoid()
    await minioClient.putObject(process.env.MINIO_BUCKET_NAME, key, req.body,req.body.size)
    await insertImage(key, schoolId as string,studentId as string)
}
const imageHandler = auth0.requireAuthentication(
    async (req: NextApiRequest, res: NextApiResponse) => {

        try {
            if (req.method === "POST") {
                await handlePost(res, req)
            } else {
                res.status(405)
            }
        } catch (error) {
            console.error(error)
            res.status(error.status || 500).end(error.message)
        }
    }
)
export default imageHandler
