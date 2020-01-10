import React, { FC, useEffect, useState } from "react"
import { Link } from "gatsby-plugin-intl3"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import Box from "../Box/Box"
import Input from "../Input/Input"
import Card from "../Card/Card"
import Typography from "../Typography/Typography"
import Flex from "../Flex/Flex"
import Icon from "../Icon/Icon"
import Spacer from "../Spacer/Spacer"
import { ReactComponent as ShareIcon } from "../../icons/share.svg"
import Button from "../Button/Button"
import useApi from "../../hooks/useApi"
import { getSchoolId } from "../../hooks/schoolIdState"
import UserCard from "../UserCard/UserCard"

export const PageSettings: FC = () => {
  const schoolId = getSchoolId()
  const [schoolName, setSchoolName] = useState("")

  // Todo: Type this correctly when we start using restful react.
  const [schoolDetail] = useApi<{
    name: string
    inviteLink: string
    users: {
      id: string
      name: string
      email: string
      isCurrentUser: boolean
    }[]
  }>(`/schools/${schoolId}`)

  useEffect(() => {
    setSchoolName(schoolDetail?.name ?? "")
  }, [schoolDetail])

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

  function shareLink(): void {
    if (navigator.share) {
      navigator.share({
        title: "Vor Invitation",
        text: "Check out vor. Manage your student data.",
        url: schoolDetail?.inviteLink,
      })
    }
  }

  return (
    <Box maxWidth="maxWidth.sm" margin="auto" p={3} pt={[3, 3, 4]}>
      <Box mb={3}>
        <Box
          p={3}
          backgroundColor="tintYellow"
          sx={{ borderRadius: "default" }}
          onClick={shareLink}
        >
          <Flex alignItems="center">
            <Box>
              <Typography.H6 mb={3}>Invite your co-workers</Typography.H6>
              <Typography.Body
                id="shareLink"
                fontSize={1}
                lineHeight="1.5em"
                sx={{ wordWrap: "break-word" }}
              >
                {schoolDetail?.inviteLink}
              </Typography.Body>
            </Box>
            <Spacer />
            <Icon minWidth={24} size={24} as={ShareIcon} m={0} mx={3} />
          </Flex>
        </Box>
      </Box>
      <SettingLink name="Curriculum" to="curriculum" />
      <Box pt={4}>
        <Typography.H5 mb={3}>Users</Typography.H5>
        {userCards}
      </Box>
      <Box pt={4}>
        <Typography.H5 mb={3}>Other Details</Typography.H5>
        <Input
          width="100%"
          label="School Name"
          mb={3}
          value={schoolName}
          onChange={e => setSchoolName(e.target.value)}
          disabled
        />
        <Flex>
          <Spacer />
          <Button disabled variant="outline" mr={2}>
            Reset
          </Button>
          <Button disabled>Save</Button>
        </Flex>
      </Box>
    </Box>
  )
}

const SettingLink: FC<{ name: string; to: string }> = ({ name, to }) => (
  <Link to={`/dashboard/settings/${to}`}>
    <Card p={3}>
      <Flex alignItems="center">
        <Typography.H6>{name}</Typography.H6>
        <Spacer />
        <Icon as={NextIcon} m={0} />
      </Flex>
    </Card>
  </Link>
)

export default PageSettings
