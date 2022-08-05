import { t, Trans } from "@lingui/macro"
import { FC, useState } from "react"
import { Box, Button } from "theme-ui"
import { usePostNewGuardian } from "../../hooks/api/guardians/usePostNewGuardian"
import { ADMIN_GUARDIAN_URL } from "../../routes"
import BackNavigation from "../BackNavigation/BackNavigation"
import Input from "../Input/Input"
import { navigate } from "../Link/Link"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import TextArea from "../TextArea/TextArea"
import { Typography } from "../Typography/Typography"

export const PageAdminNewGuardian: FC = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [note, setNote] = useState("")

  const { mutateAsync, status } = usePostNewGuardian()

  return (
    <Box mx="auto" sx={{ maxWidth: "maxWidth.sm" }}>
      <BackNavigation to={ADMIN_GUARDIAN_URL} text="All Guardians" />
      <Typography.H5 mx={3} mb={3}>
        <Trans>New Guardian</Trans>
      </Typography.H5>
      <Box p={3}>
        <Input
          value={name}
          mb={2}
          label={t`Guardian Name`}
          sx={{ width: "100%" }}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          value={email}
          mb={2}
          label={t`Email`}
          sx={{ width: "100%" }}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          type="phone"
          value={phone}
          mb={3}
          label={t`Phone`}
          sx={{ width: "100%" }}
          onChange={(event) => setPhone(event.target.value)}
        />
        <TextArea
          mb={3}
          label={t`Note`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button
          sx={{ width: "100%" }}
          disabled={name === ""}
          onClick={async () => {
            try {
              await mutateAsync({
                email,
                name,
                phone,
                note,
              })
              await navigate(ADMIN_GUARDIAN_URL)
            } catch (e) {
              Sentry.captureException(e)
            }
          }}
        >
          {status === "loading" && <LoadingIndicator color="onPrimary" />}
          <Trans>Save</Trans>
        </Button>
      </Box>
    </Box>
  )
}

export default PageAdminNewGuardian
