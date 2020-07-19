/** @jsx jsx */
import { FC } from "react"
import { graphql, useStaticQuery } from "gatsby"
import GatsbyImage, { FixedObject } from "gatsby-image"
import { jsx, Button, Flex } from "theme-ui"
import Typography from "../Typography/Typography"

import { STUDENTS_URL } from "../../routes"
import { Link } from "../Link/Link"

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
      sx={{
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Flex
        sx={{
          flexDirection: "column",
          alignItems: "center",
        }}
      >
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
          Oops, Something went wrong
        </Typography.H3>
        <Typography.H6 mb={4}>Try reloading the page, sorry</Typography.H6>
        <Flex>
          <a href="https://github.com/chrsep/obserfy/issues/new?assignees=&labels=&template=bug_report.md&title=">
            <Button variant="outline">Report Bug</Button>
          </a>
          <Link to={STUDENTS_URL} sx={{ ml: 2 }}>
            <Button>Go to Home</Button>
          </Link>
        </Flex>
        <Typography.Body
          m={3}
          mt={4}
          sx={{
            fontSize: 1,
            textAlign: "center",
          }}
          color="textMediumEmphasis"
          maxWidth={250}
          lineHeight={1.5}
        >
          Just a heads up, you&apos;ll need a Github account to report a bug.
        </Typography.Body>
      </Flex>
    </Flex>
  )
}

export default PageError
