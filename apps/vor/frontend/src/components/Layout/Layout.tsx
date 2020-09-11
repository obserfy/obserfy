import React, { FC, useEffect, useState } from "react"
import { navigate } from "gatsby"
import { Box, Flex } from "theme-ui"
import { useMatch } from "@reach/router"
import { useBreakpointIndex } from "@theme-ui/match-media"
import {
  getSchoolId,
  SCHOOL_ID_UNDEFINED_PLACEHOLDER,
} from "../../hooks/schoolIdState"
import Navbar from "../Navbar/Navbar"
import { useGetUserProfile } from "../../api/useGetUserProfile"
import Typography from "../Typography/Typography"
import StudentsList from "../StudentsList/StudentsList"

/** Top level component which encapsulate most pages. Provides Appbar and Sidebar for navigation.
 *
 * We only apply this component to core protected pages such as Home page. It is applied using
 * gatsby-plugin-layout, which loads this component dynamically using the LayoutManager located
 * in src/layouts/index.tsx.
 * */
export const Layout: FC = ({ children }) => {
  useGetUserProfile()

  const studentSubroute = useMatch("/dashboard/students/*")
  const breakpoint = useBreakpointIndex({ defaultIndex: 2 })

  if (getSchoolId() === SCHOOL_ID_UNDEFINED_PLACEHOLDER) {
    navigate("/choose-school")
  }

  return (
    <>
      <Navbar />
      <UpdateNotification />
      <Flex pl={[0, 64]} pb={[48, 0]}>
        {studentSubroute && breakpoint > 1 && <StudentsSubrouteSidebar />}
        <Box
          as="main"
          sx={{ backgroundColor: "background", width: "100%" }}
          mb="env(safe-area-inset-bottom)"
          ml={studentSubroute ? [0, 0, 300, 300, 420] : 0}
        >
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
      <Typography.Body
        color="onPrimary"
        sx={{ fontSize: 1, textAlign: "center" }}
      >
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
      position: "fixed",
      top: 0,
      flexShrink: 0,
      borderRightWidth: 1,
      borderRightStyle: "solid",
      borderRightColor: "border",
      height: "100vh",
      overflowY: "auto",
      width: [undefined, 300, 300, 300, 420],
      display: ["none", "none", "block"],
    }}
  >
    <StudentsList />
  </Box>
)

export default Layout
