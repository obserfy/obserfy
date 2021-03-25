import { t } from "@lingui/macro"
import { useLocation, useMatch } from "@reach/router"
import { StaticImage } from "gatsby-plugin-image"
import { useLocalization } from "gatsby-theme-i18n"
import React, { FC, FunctionComponent, useEffect, useState } from "react"
import { Box, Flex } from "theme-ui"
import { ReactComponent as QuestionMarkIcon } from "../../icons/question-mark.svg"
import { ReactComponent as SettingsIcon } from "../../icons/settings.svg"
import { ReactComponent as StudentsIcon } from "../../icons/home.svg"
import { ADMIN_URL, STUDENTS_URL, SUPPORT_URL } from "../../routes"
import Chatwoot from "../Chatwoot/Chatwoot"
import Icon from "../Icon/Icon"
import { Link } from "../Link/Link"
import TranslucentBar from "../TranslucentBar/TranslucentBar"

const Navbar: FC = () => {
  const [keyboardShown, setKeyboardShown] = useState(false)
  const [lastVh, setLastVh] = useState(0)

  // Hide navbar when keyboard is shown.
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
  }, [lastVh])

  return (
    <TranslucentBar
      as="nav"
      boxSx={{
        height: ["auto", "100%"],
        width: ["100%", "auto"],
        borderRadius: 0,
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
        borderColor: "borderBold",
      }}
    >
      <Flex
        sx={{
          justifyContent: ["space-evenly"],
          flexDirection: ["row", "column"],
          height: ["auto", "100%"],
        }}
        pb={["env(safe-area-inset-bottom)", 0]}
        pl="env(safe-area-inset-left)"
      >
        <Box mx="auto" my={3} sx={{ display: ["none", "block"] }}>
          <StaticImage
            src="../../images/logo-transparent.png"
            alt="obserfy logo"
            width={40}
            placeholder="blurred"
          />
        </Box>
        <NavBarItem
          title={t`Students`}
          icon={StudentsIcon}
          to={STUDENTS_URL}
          iconFill="textMediumEmphasis"
        />
        {/* <NavBarItem title="Plan" icon={CalendarIcon} to="/dashboard/plans" /> */}
        <Box mt="auto" sx={{ display: ["none", "block"] }} />
        <NavBarItem title={t`Admin`} icon={SettingsIcon} to={ADMIN_URL} />
        <NavBarItem
          title={t`Support`}
          icon={QuestionMarkIcon}
          to={SUPPORT_URL}
        />
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
  const { locale } = useLocalization()

  const match = useMatch(`${locale !== "en" ? `/${locale}` : ""}${to}/*`)
  const location = useLocation()
  const url =
    `${match?.uri}${match?.["*"] ? `/${match?.["*"]}` : ""}${
      location.search
    }` ?? ""

  // persist navigation state from each top-level sections
  useEffect(() => {
    if (match?.uri) {
      setTarget(url)
    }
  }, [url, match])

  return (
    <Link
      to={url === target ? to : target}
      state={{ preserveScroll: true }}
      style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
      onHover={() => {}}
    >
      <Flex
        sx={{
          width: [56, 48],
          height: [56, 48],
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
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
          "&:hover": {
            backgroundColor: "primaryLighter",
          },
        }}
      >
        <Icon
          alt={title}
          as={icon}
          fill={match && iconFill ? "textPrimary" : iconFill || "transparent"}
          size={24}
          sx={{ color: match ? "textPrimary" : "textMediumEmphasis" }}
        />
        {/* <Typography.Body */}
        {/*  sx={{ lineHeight: 1, fontSize: ["10px", "11px"] }} */}
        {/*  color={match ? "textPrimary" : "text"} */}
        {/* > */}
        {/*  <Trans id={title} /> */}
        {/* </Typography.Body> */}
      </Flex>
    </Link>
  )
}

export default Navbar
