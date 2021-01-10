import { StaticImage } from "gatsby-plugin-image"
import React, { FC, useEffect } from "react"
import { Box, Button, Flex } from "theme-ui"
import { STUDENTS_URL } from "../../routes"

import { Link } from "../Link/Link"
import Typography from "../Typography/Typography"

export const Page404: FC = () => {
  useEffect(() => {
    if (window.analytics) window.analytics.track("404 visited")
  }, [])

  return (
    <Flex
      sx={{
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
      pb={4}
    >
      <Flex
        sx={{
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography.H1
          sx={{ textAlign: "center", lineHeight: 1.2 }}
          m={3}
          mb={4}
        >
          404
        </Typography.H1>
        <Box mb={4}>
          <StaticImage
            src="../../images/not-found.png"
            maxWidth={180}
            alt="A missing page"
          />
        </Box>
        <Typography.Body mb={4} mx={5} sx={{ textAlign: "center" }}>
          Oops, we can&apos;t seem to find the page you are looking for.
        </Typography.Body>
        <Link to={STUDENTS_URL}>
          <Button>Go Back Home</Button>
        </Link>
      </Flex>
    </Flex>
  )
}

export default Page404
