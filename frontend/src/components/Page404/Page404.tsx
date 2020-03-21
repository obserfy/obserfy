import React, { FC } from "react"
import { graphql, useStaticQuery } from "gatsby"
import GatsbyImage, { FixedObject } from "gatsby-image"
import GatsbyLink from "gatsby-link"
import Flex from "../Flex/Flex"
import Typography from "../Typography/Typography"
import Button from "../Button/Button"
import Box from "../Box/Box"
import { OBSERVE_PAGE_URL } from "../../pages/dashboard/observe"

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
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
      pb={4}
    >
      <Flex flexDirection="column" alignItems="center">
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
        <GatsbyLink to={OBSERVE_PAGE_URL}>
          <Button>Go Back Home</Button>
        </GatsbyLink>
      </Flex>
    </Flex>
  )
}

export default Page404
