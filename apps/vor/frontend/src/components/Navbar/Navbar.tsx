import { t } from "@lingui/macro"
import { useLocation } from "@reach/router"
import { StaticImage } from "gatsby-plugin-image"
import { FC, FunctionComponent, useEffect, useState } from "react"
import { Box, Flex } from "theme-ui"
import useDetectVirtualKeyboard from "../../hooks/useDetectVirtualKeyboard"
import useLocalizedMatch from "../../hooks/useLocalizedMatch"
import { ReactComponent as FileIcon } from "../../icons/file-text.svg"
import { ReactComponent as StudentsIcon } from "../../icons/home.svg"
import { ReactComponent as SettingsIcon } from "../../icons/settings.svg"
import { ADMIN_URL, ALL_REPORT_URL, STUDENTS_URL } from "../../routes"
import Chatwoot from "../Chatwoot/Chatwoot"
import Icon from "../Icon/Icon"
import { Link } from "../Link/Link"
import TranslucentBar from "../TranslucentBar/TranslucentBar"

const Navbar: FC = () => {
  const keyboardShown = useDetectVirtualKeyboard()

  return (
    <TranslucentBar
      as="nav"
      boxSx={{
        height: ["auto", "100%"],
        width: ["100%", "auto"],
        display: [keyboardShown ? "none" : "block", "block"],
        zIndex: 500,
        top: ["auto", 0],
        bottom: [0, "auto"],
        left: 0,
        position: "fixed",

        borderTopStyle: ["solid", "none"],
        borderRightStyle: ["none", "solid"],
        borderBottomStyle: "none",
        borderLeftStyle: "none",
        borderWidth: "1px",
        borderColor: "border",
      }}
    >
      <Flex
        sx={{
          justifyContent: "space-evenly",
          flexDirection: ["row", "column"],
          height: ["auto", "100%"],
          mr: [0, "-1px"],
        }}
      >
        <Box mx="auto" my={2} mb={3} sx={{ display: ["none", "block"] }}>
          <StaticImage
            src="../../images/logo-transparent.png"
            alt="obserfy logo"
            width={34}
            placeholder="blurred"
          />
        </Box>

        <NavBarItem title={t`Students`} icon={StudentsIcon} to={STUDENTS_URL} />
        <NavBarItem
          title={t`Progress Report`}
          icon={FileIcon}
          to={ALL_REPORT_URL}
        />

        <Box mt="auto" sx={{ display: ["none", "block"] }} />
        <NavBarItem title={t`Admin`} icon={SettingsIcon} to={ADMIN_URL} />
        {/* <NavBarItem */}
        {/*  title={t`Support`} */}
        {/*  icon={QuestionMarkIcon} */}
        {/*  to={SUPPORT_URL} */}
        {/* /> */}
        <Chatwoot />
      </Flex>
    </TranslucentBar>
  )
}

const NavBarItem: FC<{
  title: string
  icon: FunctionComponent
  to: string
  iconFill?: string
}> = ({ title, icon, to, iconFill }) => {
  const [target, setTarget] = useState(to)
  const { search } = useLocation()
  const match = useLocalizedMatch(`${to}/*`)

  // imitate bottom nav backstack navigation behaviour specified in material.io
  useEffect(() => {
    if (match?.uri) {
      const url = `${match.uri}/${match["*"]}${search}`
      setTarget(url)
    }
  }, [match])

  return (
    <Link to={match ? to : target} data-cy={`navbar-${title.toLowerCase()}`}>
      <Flex
        sx={{
          width: [56, 48],
          height: [56, 48],
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          position: "relative",
          "&:after": {
            top: [-0.5, "inherit"],
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
          alt={title}
          as={icon}
          fill={match && iconFill ? "textPrimary" : iconFill || "transparent"}
          size={26}
          sx={{ color: match ? "textPrimary" : "textMediumEmphasis" }}
        />
      </Flex>
    </Link>
  )
}

export default Navbar
