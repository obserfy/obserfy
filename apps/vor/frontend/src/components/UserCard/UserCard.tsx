import { FC, useState } from "react"
import { Button, Flex, Card } from "theme-ui"
import { t } from "@lingui/macro"
import Typography from "../Typography/Typography"
import Spacer from "../Spacer/Spacer"
import Pill from "../Pill/Pill"
import useDeleteUser from "../../hooks/api/schools/useDeleteUser"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

interface Props {
  name: string
  email: string
  isCurrentUser: boolean
  userId: string
}

export const UserCard: FC<Props> = ({ userId, email, name, isCurrentUser }) => {
  const [isLoading, setIsLoading] = useState(false)
  const deleteUser = useDeleteUser(userId)

  return (
    <Card p={3} mt={2}>
      <Flex sx={{ alignItems: "start" }}>
        <Flex sx={{ flexDirection: "column", alignItems: "start" }}>
          <Typography.Body sx={{ fontWeight: "bold" }}>{name}</Typography.Body>
          <Typography.Body color="textMediumEmphasis">{email}</Typography.Body>
        </Flex>
        <Spacer />
        {isCurrentUser && (
          <Pill
            text={t`You`}
            m={1}
            color="onPrimary"
            sx={{ backgroundColor: "primary" }}
          />
        )}
        {!isCurrentUser && (
          <Button
            variant="outline"
            color="danger"
            m="auto"
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true)
              try {
                await deleteUser.mutateAsync()
              } catch (e) {
                Sentry.captureException(e)
              } finally {
                setIsLoading(false)
              }
            }}
          >
            {isLoading ? <LoadingIndicator /> : "Remove"}
          </Button>
        )}
      </Flex>
    </Card>
  )
}

export default UserCard
