import prisma from "$lib/prisma"
import { NextApiHandler } from "next"

const healthCheck: NextApiHandler = async (req, res) => {
  const testData = await prisma.schools.count({
    where: {
      students: {
        some: {
          name: {
            not: null,
          },
        },
      },
    },
  })

  res.json({ status: "OK", schoolCount: testData })
}

export default healthCheck
