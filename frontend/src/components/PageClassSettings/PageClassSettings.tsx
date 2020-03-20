import React, { FC } from "react"
import GatsbyImage, { FixedObject } from "gatsby-image"
import { graphql, useStaticQuery } from "gatsby"
import { Link } from "gatsby-plugin-intl3"
import BackNavigation from "../BackNavigation/BackNavigation"
import { SETTINGS_URL } from "../../pages/dashboard/settings"
import Flex from "../Flex/Flex"
import Typography from "../Typography/Typography"
import Button from "../Button/Button"
import { NEW_CLASS_URL } from "../../pages/dashboard/settings/class/new"

export const PageClassSettings: FC = () => {
  const astronaut = useStaticQuery(graphql`
    query {
      file: file(relativePath: { eq: "calendar-colour.png" }) {
        childImageSharp {
          fixed(width: 230, height: 230) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
    }
  `)

  return (
    <Flex flexDirection="column" maxWidth="maxWidth.md" mx="auto">
      <BackNavigation to={SETTINGS_URL} text="Settings" />
      <Flex flexDirection="column" m={3} pt={4} alignItems="center">
        <GatsbyImage
          fixed={astronaut?.file?.childImageSharp?.fixed as FixedObject}
        />
        <Typography.Body
          my={4}
          mx={4}
          sx={{ textAlign: "center" }}
          maxWidth={300}
        >
          Tell us about your classes, We&apos;ll help you track your students
          attendance.
        </Typography.Body>
        <Link to={NEW_CLASS_URL}>
          <Button>New Class</Button>
        </Link>
      </Flex>
    </Flex>
  )
}

export default PageClassSettings
