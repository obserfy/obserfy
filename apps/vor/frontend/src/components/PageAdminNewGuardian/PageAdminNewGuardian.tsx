import React, { FC, useState } from "react"
import { Button, Box } from "theme-ui"
import Input from "../Input/Input"
import TextArea from "../TextArea/TextArea"
import { navigate } from "../Link/Link"
import { ADMIN_GUARDIAN_URL } from "../../routes"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

import { usePostNewGuardian } from "../../api/guardians/usePostNewGuardian"
import BackNavigation from "../BackNavigation/BackNavigation"
import { Typography } from "../Typography/Typography"

export const PageAdminNewGuardian: FC = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [note, setNote] = useState("")

  const [mutate, { status }] = usePostNewGuardian()

  return (
    <Box mx="auto" sx={{ maxWidth: "maxWidth.sm" }}>
      <BackNavigation to={ADMIN_GUARDIAN_URL} text="All Guardians" />
      <Typography.H5 mx={3} mb={3}>
        New Guardian
      </Typography.H5>
      <Box p={3}>
        <Input
          value={name}
          mb={2}
          label="Guardian Name"
          sx={{ width: "100%" }}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          value={email}
          mb={2}
          label="Email"
          sx={{ width: "100%" }}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          type="phone"
          value={phone}
          mb={3}
          label="Phone"
          sx={{ width: "100%" }}
          onChange={(event) => setPhone(event.target.value)}
        />
        <TextArea
          mb={3}
          label="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button
          sx={{ width: "100%" }}
          disabled={name === ""}
          onClick={async () => {
            const result = await mutate({
              email,
              name,
              phone,
              note,
            })
            if (result?.status === 201) {
              await navigate(ADMIN_GUARDIAN_URL)
            }
          }}
        >
          {status === "loading" && <LoadingIndicator color="onPrimary" />}
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default PageAdminNewGuardian
