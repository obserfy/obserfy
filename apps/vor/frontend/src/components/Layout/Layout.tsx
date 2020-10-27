import React, { FC, useEffect, useState } from "react"
import { Box, Flex } from "theme-ui"
import { useMatch } from "@reach/router"
import { useBreakpointIndex } from "@theme-ui/match-media"
import { useLocalization } from "gatsby-theme-i18n"
import {
  getSchoolId,
  SCHOOL_ID_UNDEFINED_PLACEHOLDER,
} from "../../hooks/schoolIdState"
import Navbar from "../Navbar/Navbar"
import { useGetUserProfile } from "../../api/useGetUserProfile"
import Typography from "../Typography/Typography"
import StudentsList from "../StudentsList/StudentsList"
import { borderRight } from "../../border"
import { navigate } from "../Link/Link"

/** Top level component which encapsulate most pages. Provides Appbar and Sidebar for navigation.
 *
 * We only apply this component to core protected pages such as Home page. It is applied using
 * gatsby-plugin-layout, which loads this component dynamically using the LayoutManager located
 * in src/layouts/index.tsx.
 * */
export const Layout: FC = ({ children }) => {
  useGetUserProfile()

  const { locale } = useLocalization()

  const studentSubroute = useMatch(
    `${locale !== "en" ? `/${locale}` : ""}/dashboard/students/*`
  )
  const breakpoint = useBreakpointIndex({ defaultIndex: 2 })

  if (getSchoolId() === SCHOOL_ID_UNDEFINED_PLACEHOLDER) {
    navigate("/choose-school")
  }

  return (
    <>
      <Navbar />
      <Flex>
        {studentSubroute && breakpoint > 1 && <StudentsSubrouteSidebar />}
        <Box
          as="main"
          backgroundColor="background"
          mb="env(safe-area-inset-bottom)"
          pl={studentSubroute ? [0, 64, 364, 364, 484] : [0, 64]}
          sx={{ flexGrow: 1 }}
          pb={[80, 0]}
        >
          <UpdateNotification />
          {children}
        </Box>
      </Flex>
    </>
  )
}

const UpdateNotification = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    window.updateAvailable = () => {
      setUpdateAvailable(true)
    }
    return () => {
      window.updateAvailable = undefined
    }
  }, [])

  if (!updateAvailable) return <></>

  return (
    <Box py={2} sx={{ backgroundColor: "primary", width: "100%" }}>
      <Typography.Body color="onPrimary" sx={{ textAlign: "center" }}>
        <span role="img" aria-label="hooray">
          🎉🎉
        </span>{" "}
        Update is available!{" "}
        <Box
          sx={{
            display: "inline",
            textDecoration: "underline",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() => window.location.reload()}
        >
          Update Now
        </Box>
      </Typography.Body>
    </Box>
  )
}

const StudentsSubrouteSidebar = () => (
  <Box
    pb={5}
    sx={{
      ...borderRight,
      position: "fixed",
      top: 0,
      left: 0,
      flexShrink: 0,
      height: "100vh",
      overflowY: "auto",
      width: [undefined, 364, 364, 364, 484],
      display: ["none", "none", "block"],
      backgroundColor: "background",
      pl: [0, 64],
    }}
  >
    <StudentsList />
  </Box>
)

export default Layout
