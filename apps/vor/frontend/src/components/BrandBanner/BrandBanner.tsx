/** @jsx jsx */
import { FC } from "react"
import { graphql, useStaticQuery } from "gatsby"
import GatsbyImage from "gatsby-image"
import { Flex, jsx } from "theme-ui"
import { Typography } from "../Typography/Typography"

export const BrandBanner: FC = () => {
  const query = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "logo-transparent.png" }) {
        childImageSharp {
          # Specify the image processing specifications right in the query.
          # Makes it trivial to update as your page's design changes.
          fixed(width: 40, height: 40) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)

  return (
    <a href="https://obserfy.com">
      <Flex
        mx="auto"
        py={3}
        px={2}
        sx={{
          width: "100%",
          maxWidth: "maxWidth.xsm",
          alignItems: "center",
        }}
      >
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
  )
}

export default BrandBanner
