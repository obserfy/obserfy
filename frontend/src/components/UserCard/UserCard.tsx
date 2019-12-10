import React, { FC } from "react"
import Flex from "../Flex/Flex"
import Typography from "../Typography/Typography"
import Spacer from "../Spacer/Spacer"
import Card from "../Card/Card"
import Pill from "../Pill/Pill"

interface Props {
  name: string
  email: string
  isCurrentUser: boolean
}
export const UserCard: FC<Props> = ({ email, name, isCurrentUser }) => (
  <Card p={3} mt={2}>
    <Flex alignItems="start">
      <Flex flexDirection="column" alignItems="start">
        <Typography.H6>{name}</Typography.H6>
        <Typography.Body fontSize={1} color="textMediumEmphasis">
          {email}
        </Typography.Body>
      </Flex>
      <Spacer />
      {isCurrentUser && (
        <Pill text="You" backgroundColor="primary" m={1} color="onPrimary" />
      )}
    </Flex>
  </Card>
)

export default UserCard
