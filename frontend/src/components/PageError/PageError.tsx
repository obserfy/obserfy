import React, { FC } from "react"
import { graphql, useStaticQuery } from "gatsby"
import GatsbyImage, { FixedObject } from "gatsby-image"
import Flex from "../Flex/Flex"
import Typography from "../Typography/Typography"
import Button from "../Button/Button"
import { OBSERVE_PAGE_URL } from "../../routes"
import Box from "../Box/Box"

export const PageError: FC = () => {
  const astronaut = useStaticQuery(graphql`
    query AstronautImage {
      file: file(relativePath: { eq: "astronaut.png" }) {
        childImageSharp {
          fixed(width: 180, height: 180) {
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
    >
      <Flex flexDirection="column" alignItems="center">
        <GatsbyImage
          fixed={astronaut?.file?.childImageSharp?.fixed as FixedObject}
        />
        <Typography.H3
          pt={3}
          sx={{ textAlign: "center" }}
          lineHeight={1.2}
          m={3}
          mb={2}
        >
          Something went wrong
        </Typography.H3>
        <Typography.H6 mb={4}>Try reloading the page, sorry</Typography.H6>
        <Flex>
          <a href="https://github.com/chrsep/vor/issues/new?assignees=&labels=&template=bug_report.md&title=">
            <Button variant="outline">Report Bug</Button>
          </a>
          <Box as="a" href={OBSERVE_PAGE_URL} ml={3}>
            <Button>Go to Home</Button>
          </Box>
        </Flex>
        <Typography.Body
          m={3}
          mt={4}
          fontSize={1}
          color="textMediumEmphasis"
          maxWidth={250}
          textAlign="center"
          lineHeight={1.5}
        >
          Just a heads up, you&apos;ll need a Github account to report a bug.
        </Typography.Body>
      </Flex>
    </Flex>
  )
}

export default PageError
