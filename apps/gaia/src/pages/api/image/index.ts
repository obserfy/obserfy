import {NextApiRequest, NextApiResponse} from "next"
import auth0 from "../../../utils/auth0"
import {v4 as uuidv4} from 'uuid';
import {insertImage} from '../../../db'
import minioClient from "../../../utils/minio";
import {IncomingForm} from 'formidable'

export const config = {
    api: {
        bodyParser: false,
    },
};

const handlePost = async (
    res: NextApiResponse,
    req: NextApiRequest
) => {

    const schoolId = req.query.schoolId
    const studentId = req.query.studentId
    const imageId = uuidv4()
    const key = "images/" + schoolId + "/" + imageId
    const data: Buffer = await new Promise(function (resolve, reject) {
        const form = new IncomingForm();
        form.onPart = (part) => {
            part.on('data', (buffer) => {
                resolve(buffer)
            });
        };
        form.parse(req, function (err) {
            if (err) return reject(err);
        });
    });
    await minioClient.putObject(process.env.MINIO_BUCKET_NAME, key, data)
    await insertImage(imageId, key, schoolId as string, studentId as string)
    res.status(200).end()
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
