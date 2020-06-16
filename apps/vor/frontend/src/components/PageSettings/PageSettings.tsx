import React, { FC } from "react"
import { navigate } from "gatsby"
import { useColorMode, Box, Flex, Button, Card } from "theme-ui"
import { Link } from "../Link/Link"
import Typography from "../Typography/Typography"
import Icon from "../Icon/Icon"
import CardLink from "../CardLink/CardLink"
import { ReactComponent as LightModeIcon } from "../../icons/light-mode.svg"
import { ReactComponent as DarkModeIcon } from "../../icons/dark-mode.svg"
import { ReactComponent as FlipIcon } from "../../icons/flip.svg"
import { useGetSchool } from "../../api/schools/useGetSchool"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { CLASS_SETTINGS_URL } from "../../routes"

export const PageSettings: FC = () => {
  const schoolDetail = useGetSchool()

  function shareLink(): void {
    if (navigator.share) {
      navigator.share({
        title: "Vor Invitation",
        text: "Check out vor. Manage your student data.",
        url: schoolDetail.data?.inviteLink,
      })
    }
  }

  async function logout(): Promise<void> {
    const response = await fetch("/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    })
    if (response.status === 200) {
      await navigate("/login")
    }
  }

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} m="auto" p={3} pt={[3, 3, 4]}>
      <Box sx={{ width: "100%" }} mb={4}>
        {schoolDetail.status === "loading" && !schoolDetail.data?.name && (
          <LoadingPlaceholder sx={{ width: "100%", height: 60 }} />
        )}
        <Typography.H3 mb={3} ml={1}>
          {schoolDetail.data?.name}
        </Typography.H3>
        <Link to="/choose-school">
          <Button variant="outline">
            <Icon as={FlipIcon} m={0} mr={2} />
            Switch School
          </Button>
        </Link>
      </Box>
      <CardLink mb={2} name="Curriculum" to="/dashboard/settings/curriculum" />
      <CardLink mb={2} name="Users" to="/dashboard/settings/users" />
      <CardLink mb={2} name="Class" to={CLASS_SETTINGS_URL} />
      <Box mb={4}>
        <Card p={3} onClick={shareLink}>
          <Flex sx={{ alignItems: "center" }}>
            <Box>
              <Typography.H6 mb={3}>Invite your co-workers</Typography.H6>
              {schoolDetail.status === "loading" &&
                !schoolDetail.data?.inviteLink && (
                  <LoadingPlaceholder sx={{ width: "100%", height: 60 }} />
                )}
              <Typography.Body
                id="shareLink"
                lineHeight="1.5em"
                sx={{
                  fontSize: 1,
                  wordWrap: "break-word",
                }}
              >
                {schoolDetail.data?.inviteLink}
              </Typography.Body>
            </Box>
          </Flex>
        </Card>
      </Box>
      <ThemeModeButton />
      <Button
        variant="outline"
        my={2}
        color="danger"
        py={3}
        onClick={logout}
        sx={{ width: "100%" }}
      >
        Log Out
      </Button>
    </Box>
  )
}

const ThemeModeButton: FC = () => {
  const [colorMode, setColorMode] = useColorMode()
  return (
    <Button
      variant="outline"
      my={2}
      color="textMediumEmphasis"
      py={3}
      onClick={() => setColorMode(colorMode === "dark" ? "default" : "dark")}
      sx={{ width: "100%" }}
    >
      {colorMode === "dark" ? (
        <>
          <Icon as={LightModeIcon} m={0} mr={2} />
          Light Mode
        </>
      ) : (
        <>
          <Icon as={DarkModeIcon} m={0} mr={2} />
          Dark Mode
        </>
      )}
    </Button>
  )
}

export default PageSettings
