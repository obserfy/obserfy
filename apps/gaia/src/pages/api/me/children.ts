import { getSession } from "@auth0/nextjs-auth0"
import { findRelatedStudents } from "$lib/db"
import { generateOriginalUrl } from "../../../utils/imgproxy"
import { protectedApiRoute } from "../../../utils/rest"

export interface GetChildrenResponse {
  id: string
  name: string
  profilePic: string
}

const childrenHandler = protectedApiRoute(async (req, res) => {
  const session = await getSession(req, res)
  if (!session) {
    res.status(401).end("unauthorized")
    return
  }

  const students = await findRelatedStudents(session.user.email)
  res.status(200).json(
    students.map((student) => ({
      id: student.id,
      name: student.name,
      profilePic: student.images?.object_key
        ? generateOriginalUrl(student.images.object_key)
        : null,
    }))
  )
})

export default childrenHandler
