import { queryChildData } from "../../../db"
import { generateUrl } from "../../../utils/imgproxy"
import auth0 from "../../../utils/auth0"

const childHandler = auth0.requireAuthentication(async (req, res) => {
  try {
    const { user } = await auth0.getSession(req)
    const {
      query: { childId },
    } = req

    const result = await queryChildData(user.email, childId as string)
    if (!result) {
      res.status(404).end("not found")
      return
    }

    res.status(200).json({
      id: result.id,
      name: result.name,
      schoolName: result.school_name,
      profilePic:
        result.profile_pic && generateUrl(result.profile_pic, 100, 100),
    })
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
})

export default childHandler
