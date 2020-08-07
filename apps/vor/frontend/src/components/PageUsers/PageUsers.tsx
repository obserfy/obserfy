import React, { FC } from "react"
import { Box } from "theme-ui"
// import useOldApiHook from "../../api/useOldApiHook"
// import { getSchoolId } from "../../hooks/schoolIdState"
import UserCard from "../UserCard/UserCard"
import BackNavigation from "../BackNavigation/BackNavigation"
import { SETTINGS_URL } from "../../routes"
import { useGetSchool } from "../../api/schools/useGetSchool"
import useDeleteUser from "../../api/schools/useDeleteUser"

export const PageUsers: FC = () => {
  // Todo: Type this correctly when we start using restful react.
  // const [schoolDetail] = useOldApiHook<{
  //   name: string
  //   inviteLink: string
  //   users: {
  //     id: string
  //     name: string
  //     email: string
  //     isCurrentUser: boolean
  //   }[]
  // }>(`/schools/${getSchoolId()}`)
  const schoolDetail = useGetSchool()
  const deleteUser = async (id: string) => {
    console.log("deleteUser")
    await useDeleteUser(id)
  }
  const userCards = schoolDetail?.data?.users?.map(
    ({ id, name, email, isCurrentUser }) => (
      <UserCard
        key={id}
        userId={id}
        email={email}
        name={name}
        isCurrentUser={isCurrentUser}
        onDelete={deleteUser}
      />
    )
  )

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} mx="auto">
      <BackNavigation to={SETTINGS_URL} text="Settings" />
      <Box px={2}>{userCards}</Box>
    </Box>
  )
}

export default PageUsers
