import auth0 from "../../../../utils/auth0"
useGetChildImages()
import { getFirstQueryValue } from "../../../../utils/rest"
import useGetChildImages from "../../../../hooks/useGetChildImages";

export default auth0.requireAuthentication(async (req, res) => {
  try {
    // const date = getFirstQueryValue(req, "date")
    const childId = getFirstQueryValue(req, "childId")

    const plans = await getChildImages(childId as string)

    res.status(200).json(plans)
  } catch (err) {
    console.error(err)
    res.status(err.status || 500).end(err.message)
  }
})
