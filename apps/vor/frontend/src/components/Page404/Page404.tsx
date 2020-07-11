import React, { FC } from "react"
import { graphql, useStaticQuery } from "gatsby"
import GatsbyImage, { FixedObject } from "gatsby-image"
import { Flex, Button, Box } from "theme-ui"
import Typography from "../Typography/Typography"

import { Link } from "../Link/Link"
import { STUDENTS_URL } from "../../routes"

export const Page404: FC = () => {
  const notFound = useStaticQuery(graphql`
    query {
      file: file(relativePath: { eq: "not-found.png" }) {
        childImageSharp {
          fixed(width: 230, height: 180) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
    }
  `)

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
          sx={{ textAlign: "center" }}
          lineHeight={1.2}
          m={3}
          mb={4}
        >
          404
        </Typography.H1>
        <Box mb={4}>
          <GatsbyImage
            fixed={notFound?.file?.childImageSharp?.fixed as FixedObject}
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
