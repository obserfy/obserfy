import { NextApiHandler } from "next"
import { queryChildData } from "../../../db"

const childHandler: NextApiHandler = async (req, res) => {
  try {
    // const user = await auth0.getSession(req)
    // TODO: Use user's real session's email after we authenticate app with google.
    const email = "chrsep@protonmail.com"
    const {
      query: { childId },
    } = req

    const result = await queryChildData(email, childId as string)
    if (!result) {
      res.status(404).end("not found")
      return
    }

    res.status(200).json({
      id: result.id,
      name: result.name,
      schoolName: result.school_name,
      profilePic: result.profilePic,
    })
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
}

export default childHandler
