import { FC } from "react"
import { Box } from "theme-ui"
import { t } from "@lingui/macro"
import UserCard from "../UserCard/UserCard"
import BackNavigation from "../BackNavigation/BackNavigation"
import { ADMIN_URL } from "../../routes"
import { useGetSchool } from "../../hooks/api/schools/useGetSchool"

export const PageUsers: FC = () => {
  const schoolDetail = useGetSchool()
  const userCards = schoolDetail?.data?.users?.map(
    ({ id, name, email, isCurrentUser }) => (
      <UserCard
        key={id}
        userId={id}
        email={email}
        name={name}
        isCurrentUser={isCurrentUser}
      />
    )
  )

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} mx="auto">
      <BackNavigation to={ADMIN_URL} text={t`Settings`} />
      <Box px={2}>{userCards}</Box>
    </Box>
  )
}

export default PageUsers
