import React, { FC, useEffect, useState } from "react"
import { navigate } from "gatsby"
import { Box } from "theme-ui"
import {
  getSchoolId,
  SCHOOL_ID_UNDEFINED_PLACEHOLDER,
} from "../../hooks/schoolIdState"
import Navbar from "../Navbar/Navbar"
import { useGetUserProfile } from "../../api/useGetUserProfile"
import Typography from "../Typography/Typography"

/** Top level component which encapsulate most pages. Provides Appbar and Sidebar for navigation.
 *
 * We only apply this component to core protected pages such as Home page. It is applied using
 * gatsby-plugin-layout, which loads this component dynamically using the LayoutManager located
 * in src/layouts/index.tsx.
 * */
export const Layout: FC = ({ children }) => {
  useGetUserProfile()

  if (getSchoolId() === SCHOOL_ID_UNDEFINED_PLACEHOLDER) {
    navigate("/choose-school")
  }

  return (
    <>
      <Navbar />
      <Box
        as="main"
        sx={{ backgroundColor: "background", width: "100%" }}
        pl={[0, 64]}
        pb={[48, 0]}
        mb="env(safe-area-inset-bottom)"
      >
        <UpdateNotification />
        {children}
      </Box>
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

  if (!updateAvailable) return <div />

  return (
    <Box sx={{ backgroundColor: "primary", width: "100%" }}>
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

export default Layout
