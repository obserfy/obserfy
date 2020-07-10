import React, { FC } from "react"
import { navigate } from "gatsby"
import { Box, Button, Card, Flex, useColorMode } from "theme-ui"
import Typography from "../Typography/Typography"
import Icon from "../Icon/Icon"
import CardLink from "../CardLink/CardLink"
import { ReactComponent as LightModeIcon } from "../../icons/light-mode.svg"
import { ReactComponent as DarkModeIcon } from "../../icons/dark-mode.svg"
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
    <Box sx={{ maxWidth: "maxWidth.sm" }} m="auto" px={3} pt={[3, 3, 4]} pb={5}>
      <Box sx={{ width: "100%" }} mb={3}>
        {schoolDetail.status === "loading" && !schoolDetail.data?.name && (
          <LoadingPlaceholder sx={{ width: "100%", height: 60 }} />
        )}
        <Typography.H4 mb={3} ml={1} sx={{ textAlign: "center" }}>
          {schoolDetail.data?.name}
        </Typography.H4>
      </Box>
      <CardLink mb={2} name="Curriculum" to="/dashboard/settings/curriculum" />
      <CardLink mb={2} name="Users" to="/dashboard/settings/users" />
      <CardLink mb={2} name="Class" to={CLASS_SETTINGS_URL} />
      <CardLink mb={2} name="All Students" to="/dashboard/settings/students" />
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
              sx={{ wordWrap: "break-word" }}
            >
              {schoolDetail.data?.inviteLink}
            </Typography.Body>
          </Box>
        </Flex>
      </Card>
      <Flex mt={2}>
        <ThemeModeButton />
        <Button
          variant="outline"
          ml={2}
          color="warning"
          onClick={() => navigate("/choose-school")}
          sx={{ flexShrink: 0 }}
        >
          Switch school
        </Button>
        <Button
          variant="outline"
          ml={2}
          color="danger"
          onClick={logout}
          sx={{ flexShrink: 0, flexGrow: 1 }}
        >
          Log Out
        </Button>
      </Flex>
    </Box>
  )
}

const ThemeModeButton: FC = () => {
  const [colorMode, setColorMode] = useColorMode()
  return (
    <Button
      variant="outline"
      color="textMediumEmphasis"
      p={3}
      onClick={() => setColorMode(colorMode === "dark" ? "default" : "dark")}
      sx={{ flexShrink: 0 }}
    >
      {colorMode === "dark" ? (
        <Icon as={LightModeIcon} m={0} />
      ) : (
        <Icon as={DarkModeIcon} m={0} />
      )}
    </Button>
  )
}

export default PageSettings
