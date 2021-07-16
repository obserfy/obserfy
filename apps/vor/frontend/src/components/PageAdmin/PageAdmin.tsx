import { t, Trans } from "@lingui/macro"
import { FC } from "react"
import { Box, Button, Card, Flex } from "theme-ui"
import { useGetSchool } from "../../hooks/api/schools/useGetSchool"
import useLogout from "../../hooks/api/useLogout"
import { ReactComponent as BookIcon } from "../../icons/book-open.svg"
import { ReactComponent as CreditCardIcon } from "../../icons/credit-card.svg"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { ReactComponent as PersonIcon } from "../../icons/person.svg"
import { ReactComponent as SendIcon } from "../../icons/send.svg"
import {
  ADMIN_CURRICULUM_URL,
  ADMIN_GUARDIAN_URL,
  ADMIN_INVITE_USER_URL,
  ADMIN_STUDENTS_URL,
  ADMIN_SUBSCRIPTION_URL,
  ADMIN_USERS_URL,
  CLASS_SETTINGS_URL,
  SCHOOL_PROFILE_URL,
} from "../../routes"
import Icon from "../Icon/Icon"
import { Link } from "../Link/Link"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import Typography from "../Typography/Typography"
import LanguageSwitcher from "./LanguageSwitcher"
import ThemeSwitcher from "./ThemeSwitcher"

export const PageAdmin: FC = () => (
  <Box sx={{ maxWidth: "maxWidth.sm" }} m="auto" pb={5}>
    <SchoolName />

    <Card variant="responsive" mb={3}>
      <AdminLink to={ADMIN_CURRICULUM_URL} text={t`Curriculum`} />
      <AdminLink to={CLASS_SETTINGS_URL} text={t`Class`} />
      <AdminLink to={ADMIN_STUDENTS_URL} text={t`All Students`} />
      <AdminLink to={ADMIN_GUARDIAN_URL} text={t`All Guardians`} />
    </Card>

    <Card variant="responsive" mb={3}>
      <AdminLink
        icon={BookIcon}
        to={SCHOOL_PROFILE_URL}
        text={t`School Profile`}
      />
      {/* <AdminLink */}
      {/*  icon={FaceIcon} */}
      {/*  to={USER_PROFILE_URL} */}
      {/*  text={t`User Profile`} */}
      {/*  iconFill="text" */}
      {/* /> */}
    </Card>

    <Card variant="responsive" mb={3}>
      <AdminLink
        to={ADMIN_USERS_URL}
        icon={PersonIcon}
        text={t`Users`}
        iconFill="text"
      />
      <AdminLink
        to={ADMIN_INVITE_USER_URL}
        icon={SendIcon}
        text={t`Invite Your Team`}
      />
    </Card>

    <Card variant="responsive" mb={3}>
      <AdminLink
        to={ADMIN_SUBSCRIPTION_URL}
        icon={CreditCardIcon}
        text={t`Plans & Billing`}
      />
    </Card>

    <Card variant="responsive" mb={3}>
      <LanguageSwitcher />
      <ThemeSwitcher />
    </Card>

    <Flex mx={3} sx={{ flexDirection: ["column", "row"] }}>
      <ChangeSchoolButton />
      <LogoutButton />
    </Flex>
  </Box>
)

const ChangeSchoolButton = () => (
  <Link
    to="/choose-school"
    sx={{
      ml: "auto",
      display: "block",
      width: ["100%", "auto"],
      flexShrink: 0,
    }}
  >
    <Button
      variant="outline"
      color="warning"
      mb={3}
      sx={{ width: ["100%", "auto"] }}
    >
      <Trans>Switch school</Trans>
    </Button>
  </Link>
)

const LogoutButton = () => {
  const logout = useLogout()

  return (
    <Button
      variant="outline"
      ml={[0, 2]}
      color="danger"
      onClick={() => logout.mutate()}
      mb={3}
    >
      <Trans>Log Out</Trans>
    </Button>
  )
}

const SchoolName = () => {
  const schoolDetail = useGetSchool()

  if (schoolDetail.isLoading) {
    return (
      <LoadingPlaceholder
        sx={{ width: "10rem", height: 27 }}
        mx={3}
        mb={3}
        mt={4}
      />
    )
  }

  return (
    <Typography.H6 mx={3} mb={3} mt={4} sx={{ height: 27 }}>
      {schoolDetail.data?.name}
    </Typography.H6>
  )
}

const AdminLink: FC<{
  to: string
  icon?: FC
  text: string
  iconFill?: string
}> = ({ icon, text, to, iconFill = "transparent" }) => (
  <Link
    to={to}
    sx={{ display: "block", "&:hover": { backgroundColor: "primaryLightest" } }}
  >
    <Flex p={3} sx={{ alignItems: "center" }}>
      {icon && <Icon as={icon} mr={3} fill={iconFill} color="text" size={20} />}
      <Typography.Body>
        <Trans id={text} />
      </Typography.Body>
      <Icon as={NextIcon} ml="auto" />
    </Flex>
  </Link>
)

export default PageAdmin
