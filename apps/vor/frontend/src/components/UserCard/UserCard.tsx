import React, { FC } from "react"
import { Button, Flex, Card } from "theme-ui"
import Typography from "../Typography/Typography"
import Spacer from "../Spacer/Spacer"
import Pill from "../Pill/Pill"
import useDeleteUser from "../../api/schools/useDeleteUser"

interface Props {
  name: string
  email: string
  isCurrentUser: boolean
  userId: string
}

export const UserCard: FC<Props> = ({ userId, email, name, isCurrentUser }) => {
  const [deleteUser] = useDeleteUser(userId)
  return (
    <Card p={3} mt={2}>
      <Flex sx={{ alignItems: "start" }}>
        <Flex sx={{ flexDirection: "column", alignItems: "start" }}>
          <Typography.H6>{name}</Typography.H6>
          <Typography.Body
            sx={{
              fontSize: 1,
            }}
            color="textMediumEmphasis"
          >
            {email}
          </Typography.Body>
        </Flex>
        <Spacer />
        {isCurrentUser && (
          <Pill
            text="You"
            m={1}
            color="onPrimary"
            sx={{ backgroundColor: "primary" }}
          />
        )}
        {!isCurrentUser && (
          <Button
            m="auto"
            onClick={async () => {
              await deleteUser()
            }}
          >
            Remove
          </Button>
        )}
      </Flex>
    </Card>
  )
}

export default UserCard
