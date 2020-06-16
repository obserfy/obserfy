import React, { FC } from "react"
import { Box } from "theme-ui"
import useOldApiHook from "../../api/useOldApiHook"
import { getSchoolId } from "../../hooks/schoolIdState"
import UserCard from "../UserCard/UserCard"
import BackNavigation from "../BackNavigation/BackNavigation"

export const PageUsers: FC = () => {
  // Todo: Type this correctly when we start using restful react.
  const [schoolDetail] = useOldApiHook<{
    name: string
    inviteLink: string
    users: {
      id: string
      name: string
      email: string
      isCurrentUser: boolean
    }[]
  }>(`/schools/${getSchoolId()}`)

  const userCards = schoolDetail?.users?.map(
    ({ id, name, email, isCurrentUser }) => (
      <UserCard
        key={id}
        email={email}
        name={name}
        isCurrentUser={isCurrentUser}
      />
    )
  )

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} mx="auto">
      <BackNavigation to="/dashboard/settings" text="Settings" />
      <Box px={2}>{userCards}</Box>
    </Box>
  )
}

export default PageUsers
