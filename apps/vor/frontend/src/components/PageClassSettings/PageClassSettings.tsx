import { Trans } from "@lingui/macro"
import { StaticImage } from "gatsby-plugin-image"
import { FC } from "react"
import { Box, Button, Card, Flex } from "theme-ui"

import useGetSchoolClasses from "../../hooks/api/classes/useGetSchoolClasses"
import { ADMIN_URL, EDIT_CLASS_URL, NEW_CLASS_URL } from "../../routes"
import BackNavigation from "../BackNavigation/BackNavigation"
import { Link } from "../Link/Link"

import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import Typography from "../Typography/Typography"

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
      <BackNavigation to={ADMIN_URL} text="Settings" />
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
            <Trans>Classes</Trans>
          </Typography.H4>
          <Link to={NEW_CLASS_URL}>
            <Button>
              <Trans>New</Trans>
            </Button>
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

const NoClassPlaceholder: FC = () => (
  <Flex
    m={3}
    pt={4}
    sx={{
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <StaticImage
      src="../../images/calendar-colour.png"
      width={230}
      alt="a person pointing at a calendar"
      placeholder="blurred"
    />
    <Typography.Body my={4} mx={4} sx={{ textAlign: "center", maxWidth: 300 }}>
      <Trans>
        Tell us about your classes, We&apos;ll help you track your students
        attendance.
      </Trans>
    </Typography.Body>
    <Link to={NEW_CLASS_URL}>
      <Button>
        <Trans>New Class</Trans>
      </Button>
    </Link>
  </Flex>
)

const LoadingState: FC = () => (
  <Box m={3}>
    <LoadingPlaceholder sx={{ width: "20rem", height: 48 }} mb={3} />
    <LoadingPlaceholder sx={{ width: "100%", height: 62 }} mb={2} />
    <LoadingPlaceholder sx={{ width: "100%", height: 62 }} mb={2} />
    <LoadingPlaceholder sx={{ width: "100%", height: 62 }} mb={2} />
  </Box>
)

export default PageClassSettings
