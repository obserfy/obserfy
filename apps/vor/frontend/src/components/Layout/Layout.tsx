import { Trans } from "@lingui/macro"
import { useMatch } from "@reach/router"
import { useBreakpointIndex } from "@theme-ui/match-media"
import { useLocalization } from "gatsby-theme-i18n"
import { FC, useEffect, useState } from "react"
import { Box, Button, Flex } from "theme-ui"
import { borderBottom, borderFull, borderRight } from "../../border"
import { useGetUserProfile } from "../../hooks/api/useGetUserProfile"
import {
  getSchoolId,
  SCHOOL_ID_UNDEFINED_PLACEHOLDER,
} from "../../hooks/schoolIdState"
import useIsTrialOverdue from "../../hooks/useIsTrialOverdue"
import { ADMIN_SUBSCRIPTION_URL } from "../../routes"
import { Link, navigate } from "../Link/Link"
import Navbar from "../Navbar/Navbar"
import { NewStudentFormProvider } from "../PageNewStudent/NewStudentFormContext"
import StudentsList from "../StudentsList/StudentsList"
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
      <Flex pl={[0, 48]} pb={[4, 4, 0]}>
        <StudentsSubrouteSidebar />
        <Box
          as="main"
          backgroundColor="background"
          mb="env(safe-area-inset-bottom)"
          sx={{ flexGrow: 1 }}
          pb={[80, 0]}
        >
          <UpdateNotification />
          <TrialOverdueNotification />
          <NewStudentFormProvider>
            <Box>{children}</Box>
          </NewStudentFormProvider>
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

const TrialOverdueNotification = () => {
  const trialOverdue = useIsTrialOverdue()

  if (!trialOverdue) {
    return <></>
  }

  return (
    <Box
      py={2}
      sx={{ backgroundColor: "warning", width: "100%", ...borderBottom }}
    >
      <Flex sx={{ alignItems: "center", justifyContent: "center" }}>
        <Typography.Body color="onWarning" mr={3} sx={{ fontWeight: "bold" }}>
          <Trans>Trial period has ended.</Trans>
        </Typography.Body>

        <Link to={ADMIN_SUBSCRIPTION_URL}>
          <Button
            variant="outline"
            sx={{
              ...borderFull,
              fontWeight: "bold",
              backgroundColor: "white",
              color: "textWarning",
            }}
          >
            <Trans>Subscribe</Trans>
          </Button>
        </Link>
      </Flex>
    </Box>
  )
}

const StudentsSubrouteSidebar = () => {
  const breakpoint = useBreakpointIndex({ defaultIndex: 2 })
  const { locale } = useLocalization()

  const studentSubroute = useMatch(
    `${locale !== "en" ? `/${locale}` : ""}/dashboard/students/*`
  )

  if (studentSubroute && breakpoint > 1) {
    return (
      <Box
        sx={{
          ...borderRight,
          position: "sticky",
          top: 0,
          left: 0,
          bottom: 0,
          flexShrink: 0,
          height: "100vh",
          overflowY: "auto",
          width: [0, 0, 340],
          backgroundColor: "background",
        }}
      >
        <StudentsList />
      </Box>
    )
  }
  return <div />
}

export default Layout
