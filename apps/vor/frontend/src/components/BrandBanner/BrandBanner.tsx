/** @jsx jsx */
import { FC } from "react"
import { graphql, useStaticQuery } from "gatsby"
import GatsbyImage from "gatsby-image"
import { Flex, jsx, Box } from "theme-ui"
import { Typography } from "../Typography/Typography"

export const BrandBanner: FC = () => {
  const query = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "logo-standalone.png" }) {
        childImageSharp {
          # Specify the image processing specifications right in the query.
          # Makes it trivial to update as your page's design changes.
          fixed(width: 32, height: 32) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)

  return (
    <Box mx="auto" p={3} sx={{ width: "100%", maxWidth: "maxWidth.xsm" }}>
      <a href="https://obserfy.com" sx={{ display: "inline-block" }}>
        <Flex sx={{ alignItems: "center" }}>
          <GatsbyImage
            fixed={query.file.childImageSharp.fixed}
            sx={{ flexShrink: 0 }}
          />
          <Typography.Body
            ml={2}
            sx={{ fontSize: 3, fontWeight: "bold", lineHeight: 1.2 }}
          >
            Obserfy{" "}
            <span sx={{ fontWeight: "normal", whiteSpace: "nowrap" }}>
              for Teachers
            </span>
          </Typography.Body>
        </Flex>
      </a>
    </Box>
  )
}

export default BrandBanner
