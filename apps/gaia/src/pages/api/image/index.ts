import { NextApiRequest, NextApiResponse } from "next"
import { v4 as uuidv4 } from "uuid"
import { File, IncomingForm } from "formidable-serverless"
import { promises as fs } from "fs"
import auth0 from "../../../utils/auth0"
import { insertImage } from "../../../db"
import uploadFile from "../../../utils/minio"

export const config = {
  api: {
    bodyParser: false,
  },
}

const handlePost = async (res: NextApiResponse, req: NextApiRequest) => {
  const { studentId, schoolId } = req.query
  const imageId = uuidv4()
  const key = `images/${schoolId}/${imageId}`

  // Parse form
  const data = await new Promise<File>((resolve, reject) => {
    const form = new IncomingForm()
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      resolve(files.image)
      return null
    })
  })

  // Save image
  const file = await fs.readFile(data.path)
  await uploadFile(key, file)
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
