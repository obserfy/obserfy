import React, { FC, FunctionComponent, useEffect, useState } from "react"
import { graphql, useStaticQuery } from "gatsby"
import GatsbyImage from "gatsby-image"
import { useLocation, useMatch } from "@reach/router"
import { Box, Flex } from "theme-ui"
import { ReactComponent as SettingsIcon } from "../../icons/settings.svg"
import { ReactComponent as StudentsIcon } from "../../icons/students.svg"
import { ReactComponent as MessageIcon } from "../../icons/message.svg"
import { Link } from "../Link/Link"
import Icon from "../Icon/Icon"
import { Typography } from "../Typography/Typography"
import { SETTINGS_URL, STUDENTS_URL, SUPPORT_URL } from "../../routes"
import TranslucentBar from "../TranslucentBar/TranslucentBar"

const Navbar: FC = () => {
  const [keyboardShown, setKeyboardShown] = useState(false)
  const [lastVh, setLastVh] = useState(0)

  const query = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "logo-transparent.png" }) {
        childImageSharp {
          # Specify the image processing specifications right in the query.
          # Makes it trivial to update as your page's design changes.
          fixed(width: 40, height: 40) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)

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
        zIndex: 5,
        top: ["auto", 0],
        bottom: [0, "auto"],
        left: 0,
        position: "fixed",
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: "borderSolid",
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
        <Box mx="auto" my={3} sx={{ display: ["none", "block"] }} mb={4}>
          <GatsbyImage fixed={query.file.childImageSharp.fixed} />
        </Box>
        <NavBarItem title="Students" icon={StudentsIcon} to={STUDENTS_URL} />
        {/* <NavBarItem title="Plan" icon={CalendarIcon} to="/dashboard/plans" /> */}
        <Box
          sx={{
            height: "100%",
            display: ["none", "block"],
          }}
        />
        <NavBarItem title="Admin" icon={SettingsIcon} to={SETTINGS_URL} />
        <NavBarItem title="Support" icon={MessageIcon} to={SUPPORT_URL} />
      </Flex>
    </TranslucentBar>
  )
}

const NavBarItem: FC<{
  title: string
  icon: FunctionComponent
  to: string
}> = ({ title, icon, to }) => {
  const match = useMatch(`${to}/*`)
  const [target, setTarget] = useState(to)
  const location = useLocation()
  const url = `${match?.uri}/${match?.["*"]}${location.search}` ?? ""

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
    >
      <Flex
        mb={[0, 2]}
        py={1}
        sx={{
          width: [60, 64],
          height: [48, 60],
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
        }}
      >
        <Icon
          as={icon}
          fill="transparent"
          size={24}
          sx={{ color: match ? "textPrimary" : "textDisabled" }}
        />
        <Typography.Body
          sx={{ lineHeight: 1, fontSize: ["10px", 0] }}
          color={match ? "textPrimary" : "textMediumEmphasis"}
        >
          {title}
        </Typography.Body>
      </Flex>
    </Link>
  )
}

export default Navbar
