import React, { FC, FunctionComponent, useEffect, useState } from "react"
import { navigate } from "gatsby"
import { Link } from "gatsby-plugin-intl3"
import { useMatch } from "@reach/router"
import { Typography } from "../Typography/Typography"
import Icon from "../Icon/Icon"
import Box from "../Box/Box"
import Flex, { FlexProps } from "../Flex/Flex"
import { ReactComponent as SettingsIcon } from "../../icons/settings.svg"
import { ReactComponent as EditIcon } from "../../icons/edit2.svg"
import { ReactComponent as PieChartIcon } from "../../icons/pie-chart.svg"
import {
  getSchoolId,
  SCHOOL_ID_UNDEFINED_PLACEHOLDER,
} from "../../hooks/schoolIdState"
import Card from "../Card/Card"

/** Top level component which encapsulate most pages. Provides Appbar and Sidebar for navigation.
 *
 * We only apply this component to core protected pages such as Home page. It is applied using
 * gatsby-plugin-layout, which loads this component dynamically using the LayoutManager located
 * in src/layouts/index.tsx.
 * */
export const Layout: FC = ({ children }) => {
  if (getSchoolId() === SCHOOL_ID_UNDEFINED_PLACEHOLDER) {
    navigate("/choose-school")
  }

  return (
    <>
      <NavBar />
      <Box
        as="main"
        width="100%"
        pl={[0, 70]}
        pb={[48, 0]}
        backgroundColor="background"
      >
        {children}
      </Box>
    </>
  )
}

const NavBar: FC = () => {
  const [keyboardShown, setKeyboardShown] = useState(false)
  const [lastVh, setLastVh] = useState(0)

  useEffect(() => {
    const listener: EventListener = () => {
      const vh = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      )
      if (vh === lastVh) return
      if (vh < 400) {
        setKeyboardShown(true)
        setLastVh(vh)
      } else {
        setKeyboardShown(false)
        setLastVh(vh)
      }
    }
    window.addEventListener("resize", listener)
    return () => {
      window.removeEventListener("resize", listener)
    }
  })
  return (
    <Card
      display={[keyboardShown ? "none" : "block", "block"]}
      as="nav"
      borderRadius={0}
      height={["auto", "100%"]}
      width={["100%", 70]}
      backgroundColor="surfaceTransparent"
      sx={{
        // backdropFilter: "saturate(180%) blur(20px)",
        zIndex: 5,
        top: ["auto", 0],
        bottom: [0, "auto"],
        left: 0,
        position: "fixed",
        borderTopStyle: "solid",
        borderTopWidth: 1,
        borderTopColor: "border",
      }}
      pt={[0, 2]}
    >
      <Flex
        flexDirection={["row", "column"]}
        justifyContent={["space-evenly"]}
        height={["auto", "100%"]}
      >
        <Box height={70} width={70} display={["none", "block"]} />
        <NavBarItem title="Observe" icon={EditIcon} to="/dashboard/observe" />
        <NavBarItem
          title="Analyze"
          icon={PieChartIcon}
          to="/dashboard/analyze"
        />
        <Box height="100%" display={["none", "block"]} />
        <NavBarItem
          title="Settings"
          icon={SettingsIcon}
          to="/dashboard/settings"
        />
      </Flex>
    </Card>
  )
}

const NavBarItem: FC<{
  title: string
  icon: FunctionComponent
  to: string
}> = ({ title, icon, to }) => {
  const match = useMatch(`${to}/*`)

  return (
    <Link
      to={to}
      style={{
        outline: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="space-around"
        height={[48, 60]}
        mb={[0, 2]}
        width={[60, 70]}
        py={1}
        sx={{
          position: "relative",
          "&:after": {
            top: [0, "inherit"],
            right: ["inherit", 0],
            position: "absolute",
            backgroundColor: "textPrimary",
            borderRadius: ["0 0 10px 10px", "10px 0 0 10px"],
            width: [match ? "100%" : "0%", 2],
            height: [2, match ? "100%" : "0%"],
            content: "''",
            transition: "width 100ms cubic-bezier(0.0, 0.0, 0.2, 1)",
          },
        }}
      >
        <Icon
          as={icon}
          m={0}
          size={24}
          fill={match ? "textPrimary" : "textDisabled"}
        />
        <Typography.Body
          lineHeight={1}
          fontSize={["10px", 0]}
          color={match ? "textPrimary" : "textMediumEmphasis"}
          fontWeight={match ? "bold" : "normal"}
        >
          {title}
        </Typography.Body>
      </Flex>
    </Link>
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
