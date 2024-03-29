import { t, Trans } from "@lingui/macro"
import { useLocation } from "@reach/router"
import { StaticImage } from "gatsby-plugin-image"
import { FC, FunctionComponent, useEffect, useState } from "react"
import { Box, Flex } from "theme-ui"
import { getSchoolId } from "../../hooks/schoolIdState"
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
import Typography from "../Typography/Typography"

const Navbar: FC = () => {
  const keyboardShown = useDetectVirtualKeyboard()
  const schoolId = getSchoolId()

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
        {schoolId === "4071128c-8526-437e-8484-84722aecc70c" && (
          <NavBarItem title={t`Reports`} icon={FileIcon} to={ALL_REPORT_URL} />
        )}

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
          justifyContent: "center",
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
          mb={1}
        />
        <Typography.Body
          sx={{
            lineHeight: 1,
            fontSize: ["10px", "11px"],
            display: ["block", "none"],
          }}
          color={match ? "textPrimary" : "text"}
        >
          <Trans id={title} />
        </Typography.Body>
      </Flex>
    </Link>
  )
}

export default Navbar
