import React, { FC } from "react"
import { graphql, useStaticQuery } from "gatsby"
import GatsbyImage, { FixedObject } from "gatsby-image"
import Flex from "../Flex/Flex"
import Typography from "../Typography/Typography"
import Button from "../Button/Button"
import { AvatarPlaceholderQuery } from "../../gatsbyGql"
import { openCrispChat } from "../../crisp"

export const PageError: FC = () => {
  const astronaut = useStaticQuery<AvatarPlaceholderQuery>(graphql`
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
          <Button variant="outline" onClick={openCrispChat}>
            Report Bug
          </Button>
          <Button ml={3} onClick={() => window?.location?.reload()}>
            Reload Page
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default PageError
