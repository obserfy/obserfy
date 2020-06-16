import React, { FC } from "react"
import { navigate } from "gatsby"
import { Box } from "theme-ui"
import {
  getSchoolId,
  SCHOOL_ID_UNDEFINED_PLACEHOLDER,
} from "../../hooks/schoolIdState"
import Navbar from "../Navbar/Navbar"

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
      <Navbar />
      <Box
        as="main"
        sx={{
          backgroundColor: "background",
          width: "100%",
        }}
        pl={[0, 70]}
        pb={[48, 0]}
        mb="env(safe-area-inset-bottom)"
      >
        {children}
      </Box>
    </>
  )
}

export default Layout
