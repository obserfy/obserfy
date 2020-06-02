import auth0 from "../../../../utils/auth0"

export default auth0.requireAuthentication(async (req, res) => {
  res.status(200).json([])
})
