import React, { FC } from "react"
import { navigate } from "gatsby"
import { Box, Button, Flex, useColorMode } from "theme-ui"
import { useGetSchool } from "../../api/schools/useGetSchool"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import Typography from "../Typography/Typography"
import CardLink from "../CardLink/CardLink"
import {
  ADMIN_CURRICULUM_URL,
  ADMIN_GUARDIAN_URL,
  ADMIN_INVITE_USER_URL,
  ADMIN_STUDENTS_URL,
  ADMIN_SUBSCRIPTION_URL,
  ADMIN_USERS_URL,
  CLASS_SETTINGS_URL,
} from "../../routes"
import Icon from "../Icon/Icon"
import { ReactComponent as LightModeIcon } from "../../icons/light-mode.svg"
import { ReactComponent as DarkModeIcon } from "../../icons/dark-mode.svg"

export const PageAdmin: FC = () => {
  const schoolDetail = useGetSchool()

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
      <CardLink mb={2} name="Curriculum" to={ADMIN_CURRICULUM_URL} />
      <CardLink mb={2} name="Users" to={ADMIN_USERS_URL} />
      <CardLink mb={2} name="Class" to={CLASS_SETTINGS_URL} />
      <CardLink mb={2} name="All Students" to={ADMIN_STUDENTS_URL} />
      <CardLink mb={2} name="All Guardians" to={ADMIN_GUARDIAN_URL} />
      <CardLink mb={2} name="Invite Your Team" to={ADMIN_INVITE_USER_URL} />
      <CardLink mb={2} name="Subscription Plan" to={ADMIN_SUBSCRIPTION_URL} />
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
      data-cy={colorMode === "dark" ? "light-switch" : "dark-switch"}
    >
      {colorMode === "dark" ? (
        <Icon as={LightModeIcon} m={0} />
      ) : (
        <Icon as={DarkModeIcon} m={0} />
      )}
    </Button>
  )
}

export default PageAdmin
