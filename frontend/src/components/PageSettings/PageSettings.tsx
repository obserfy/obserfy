import React, { FC } from "react"
import { navigate } from "gatsby"
import { useColorMode } from "theme-ui"
import Box from "../Box/Box"
import Typography from "../Typography/Typography"
import Flex from "../Flex/Flex"
import Icon from "../Icon/Icon"
import Spacer from "../Spacer/Spacer"
import { ReactComponent as ShareIcon } from "../../icons/share.svg"
import Button from "../Button/Button"
import useOldApiHook from "../../api/useOldApiHook"
import { getSchoolId } from "../../hooks/schoolIdState"
import UserCard from "../UserCard/UserCard"
import CardLink from "../CardLink/CardLink"
import { ReactComponent as LightModeIcon } from "../../icons/light-mode.svg"
import { ReactComponent as DarkModeIcon } from "../../icons/dark-mode.svg"

export const PageSettings: FC = () => {
  const schoolId = getSchoolId()

  // Todo: Type this correctly when we start using restful react.
  const [schoolDetail] = useOldApiHook<{
    name: string
    inviteLink: string
    users: {
      id: string
      name: string
      email: string
      isCurrentUser: boolean
    }[]
  }>(`/schools/${schoolId}`)

  const userCards = schoolDetail?.users?.map(
    ({ id, name, email, isCurrentUser }) => (
      <UserCard
        key={id}
        email={email}
        name={name}
        isCurrentUser={isCurrentUser}
      />
    )
  )

  function shareLink(): void {
    if (navigator.share) {
      navigator.share({
        title: "Vor Invitation",
        text: "Check out vor. Manage your student data.",
        url: schoolDetail?.inviteLink,
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
    <Box maxWidth="maxWidth.sm" margin="auto" p={3} pt={[3, 3, 4]}>
      <Box mb={4}>
        <Box
          p={3}
          backgroundColor="tintYellow"
          sx={{ borderRadius: "default" }}
          onClick={shareLink}
        >
          <Flex alignItems="center">
            <Box>
              <Typography.H6 mb={3}>Invite your co-workers</Typography.H6>
              <Typography.Body
                id="shareLink"
                fontSize={1}
                lineHeight="1.5em"
                sx={{ wordWrap: "break-word" }}
              >
                {schoolDetail?.inviteLink}
              </Typography.Body>
            </Box>
            <Spacer />
            <Icon minWidth={24} size={24} as={ShareIcon} m={0} mx={3} />
          </Flex>
        </Box>
      </Box>
      <CardLink name="Curriculum" to="/dashboard/settings/curriculum" />
      <Box pt={4} mb={4}>
        <Typography.H5 mb={3}>Users</Typography.H5>
        {userCards}
      </Box>
      <ThemeModeButton />
      <Button
        variant="outline"
        my={3}
        width="100%"
        color="danger"
        py={3}
        onClick={logout}
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
      my={3}
      width="100%"
      color="textMediumEmphasis"
      py={3}
      onClick={() => setColorMode(colorMode === "dark" ? "default" : "dark")}
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
