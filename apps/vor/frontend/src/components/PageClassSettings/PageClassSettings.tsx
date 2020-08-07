import React, { FC } from "react"
import GatsbyImage, { FixedObject } from "gatsby-image"
import { graphql, useStaticQuery } from "gatsby"
import { Flex, Button, Card, Box } from "theme-ui"
import { Link } from "../Link/Link"
import BackNavigation from "../BackNavigation/BackNavigation"
import { SETTINGS_URL, NEW_CLASS_URL, EDIT_CLASS_URL } from "../../routes"
import Typography from "../Typography/Typography"

import useGetSchoolClasses from "../../api/classes/useGetSchoolClasses"

import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"

export const PageClassSettings: FC = () => {
  const classes = useGetSchoolClasses()

  const haveNoClass = classes.status === "success" && classes.data?.length === 0

  return (
    <Flex
      sx={{
        flexDirection: "column",
        maxWidth: "maxWidth.md",
      }}
      mx="auto"
    >
      <BackNavigation to={SETTINGS_URL} text="Settings" />
      {classes.status === "loading" && <LoadingState />}
      {haveNoClass && <NoClassPlaceholder />}
      {(classes.data?.length ?? 0) > 0 && (
        <Flex sx={{ alignItems: "center" }} m={3}>
          <Typography.H4
            mr="auto"
            sx={{
              lineHeight: 1,
            }}
          >
            Classes
          </Typography.H4>
          <Link to={NEW_CLASS_URL}>
            <Button>New</Button>
          </Link>
        </Flex>
      )}
      {classes.data?.map(({ id, name }) => (
        <Link key={id} to={EDIT_CLASS_URL(id)}>
          <Card mx={3} mb={2} p={3}>
            <Typography.Body>{name}</Typography.Body>
          </Card>
        </Link>
      ))}
    </Flex>
  )
}

const NoClassPlaceholder: FC = () => {
  const illustration = useStaticQuery(graphql`
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
    <Flex
      m={3}
      pt={4}
      sx={{
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <GatsbyImage
        fixed={illustration?.file?.childImageSharp?.fixed as FixedObject}
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
  )
}

const LoadingState: FC = () => (
  <Box m={3}>
    <LoadingPlaceholder sx={{ width: "20rem", height: 48 }} mb={3} />
    <LoadingPlaceholder sx={{ width: "100%", height: 62 }} mb={2} />
    <LoadingPlaceholder sx={{ width: "100%", height: 62 }} mb={2} />
    <LoadingPlaceholder sx={{ width: "100%", height: 62 }} mb={2} />
  </Box>
)

export default PageClassSettings
