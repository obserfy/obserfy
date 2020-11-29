import { findChildById } from "../../../../db/queries"
import { generateUrl } from "../../../../utils/imgproxy"
import auth0 from "../../../../utils/auth0"
import { protectedApiRoute } from "../../../../utils/rest"

export interface GetChildResponse {
  id: string
  name: string
  schoolName: string
  profilePic: string
  schoolId: string
}

const childHandler = protectedApiRoute(async (req, res) => {
  const session = await auth0.getSession(req)
  if (!session) {
    res.status(401).end("unauthorized")
    return
  }

  const { childId } = req.query

  const result = await findChildById(session.user.email, childId as string)
  if (!result) {
    res.status(404).end("not found")
    return
  }
  const response: GetChildResponse = {
    id: result.id,
    name: result.name,
    schoolName: result.school_name,
    schoolId: result.school_id,
    profilePic: result.object_key && generateUrl(result.object_key, 200, 200),
  }
  res.status(200).json(response)
})

export default childHandler
