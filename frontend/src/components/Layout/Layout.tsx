import React, { FC, useState } from "react"
import { useColorMode } from "theme-ui"
import { navigate } from "gatsby"
import AppBar, { SchoolName } from "../AppBar/AppBar"
import SideBar from "../SideBar/SideBar"
import { ReactComponent as HomeIcon } from "../../icons/home.svg"
import { ReactComponent as SettingsIcon } from "../../icons/settings.svg"
import { ReactComponent as LightModeIcon } from "../../icons/light-mode.svg"
import { ReactComponent as DarkModeIcon } from "../../icons/dark-mode.svg"
import NavigationItem from "../NavigationItem/NavigationItem"
import { Typography } from "../Typography/Typography"
import Spacer from "../Spacer/Spacer"
import Icon from "../Icon/Icon"
import Box from "../Box/Box"
import Flex, { FlexProps } from "../Flex/Flex"
import {
  SCHOOL_ID_UNDEFINED_PLACEHOLDER,
  getSchoolId,
} from "../../hooks/schoolIdState"

/** Top level component which encapsulate most pages. Provides Appbar and Sidebar for navigation.
 *
 * We only apply this component to core protected pages such as Home page. It is applied using
 * gatsby-plugin-layout, which loads this component dynamically using the LayoutManager located
 * in src/layouts/index.tsx.
 * */
interface Props {
  pageTitle: string
}

export const Layout: FC<Props> = ({ pageTitle, children }) => {
  const [isSidebarShown, setShowSidebar] = useState(false)
  const toggleSidebar = (): void => setShowSidebar(!isSidebarShown)

  const schoolId = getSchoolId()
  if (schoolId === SCHOOL_ID_UNDEFINED_PLACEHOLDER) {
    navigate("/choose-school")
  }

  return (
    <>
      <AppBar title={pageTitle} onMenuClick={toggleSidebar} position="fixed" />
      <MainSidebar closeSidebar={toggleSidebar} isShown={isSidebarShown} />
      <Box
        as="main"
        width="100%"
        mt="57px"
        pl={[0, 230]}
        backgroundColor="background"
      >
        {children}
      </Box>
    </>
  )
}

const MainSidebar: FC<{
  closeSidebar: () => void
  isShown: boolean
}> = ({ closeSidebar, isShown }) => {
  const [colorMode, setColorMode] = useColorMode()
  return (
    <SideBar isShown={isShown} onOutsideClick={closeSidebar}>
      <SchoolName
        backgroundColor="surface"
        mb={3}
        alignItems="center"
        width="100%"
        opacity={[1, 0]}
        sx={{ boxShadow: "low" }}
      />
      <NavigationItem
        onClick={closeSidebar}
        to="/dashboard/home"
        text="Home"
        icon={HomeIcon}
      />
      <Spacer />
      <NavigationItem
        onClick={closeSidebar}
        to="/dashboard/settings"
        text="settings"
        icon={SettingsIcon}
        mb={3}
      />
      <SidebarToggleItem
        onClick={() => {
          setColorMode(colorMode === "dark" ? "default" : "dark")
        }}
        text={colorMode === "dark" ? "Light Mode" : "Dark Mode"}
        icon={colorMode === "dark" ? LightModeIcon : DarkModeIcon}
        data-cy="toggleTheme"
      />
    </SideBar>
  )
}

interface SidebarToggleItemProps extends FlexProps {
  text: string
  icon?: FC
}

export const SidebarToggleItem: FC<SidebarToggleItemProps> = ({
  text,
  icon,
  ...props
}) => {
  return (
    // eslint-disable-next-line react/jsx-no-undef
    <Flex
      as="button"
      alignItems="center"
      m={2}
      my={0}
      pl={2}
      sx={{
        borderStyle: "none",
        cursor: "pointer",
        borderRadius: "default",
        textDecoration: "none",
        backgroundColor: "transparent",
        "&:hover": {
          backgroundColor: "primaryLightest",
        },
      }}
      {...props}
    >
      <Icon
        alt={`${text} icon`}
        ml={0}
        my={2}
        as={icon}
        sx={{ fill: "textMediumEmphasis" }}
      />
      <Typography.Body m={0} fontSize={1} color="textMediumEmphasis">
        {text}
      </Typography.Body>
    </Flex>
  )
}

export default Layout
