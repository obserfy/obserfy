import formidable from "formidable-serverless"
import { promises as fs } from "fs"
import { NextApiRequest, NextApiResponse } from "next"
import { v4 as uuidv4 } from "uuid"
import { insertImage } from "../../../db/queries"
import uploadFile from "../../../utils/minio"
import { protectedApiRoute } from "../../../utils/rest"

export const config = {
  api: {
    bodyParser: false,
  },
}

const handlePost = async (res: NextApiResponse, req: NextApiRequest) => {
  const { childId, schoolId, imageId } = req.query

  if (!childId || Array.isArray(childId)) {
    res.status(400).end("invalid childId")
    return
  }
  if (!schoolId || Array.isArray(schoolId)) {
    res.status(400).end("invalid schoolId")
    return
  }
  if (Array.isArray(imageId)) {
    res.status(400).end("don't use multiple imageId")
    return
  }

  // Parse form
  const data = await new Promise<formidable.File>((resolve, reject) => {
    const form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      if (!Array.isArray(files.image)) {
        resolve(files.image)
      } else {
        reject(new Error("can't process multiple images"))
      }

      return null
    })
  })

  if (!data) {
    res.status(400).end("request must include an image file")
    return
  }

  // Save image
  const key = `images/${schoolId}/${imageId}`
  const file = await fs.readFile(data.path)
  await uploadFile(key, file)
  await insertImage(imageId ?? uuidv4(), key, schoolId, childId)
  res.status(200).end()
}

const imageHandler = protectedApiRoute(async (req, res) => {
  if (req.method === "POST") {
    await handlePost(res, req)
  } else {
    res.status(405)
  }
})

export default imageHandler
