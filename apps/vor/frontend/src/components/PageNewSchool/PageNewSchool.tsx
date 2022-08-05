import { FC, FormEvent, useState } from "react"
import { Flex, Box, Button } from "theme-ui"
import { Trans } from "@lingui/macro"
import { navigate } from "../Link/Link"
import { Typography } from "../Typography/Typography"
import Input from "../Input/Input"

async function submitNewSchoolForm(name: string) {
  const data = { name }
  const response = await fetch("/api/v1/schools", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (response.status === 201) await navigate("/choose-school")
}

export const PageNewSchool: FC = () => {
  const [name, setName] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    await submitNewSchoolForm(name)
  }

  return (
    <Flex
      sx={{
        justifyContent: "center",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
      pt={6}
    >
      <Box
        as="form"
        p={3}
        sx={{ width: "100%", maxWidth: "maxWidth.sm" }}
        onSubmit={handleSubmit}
        mt={-5}
      >
        <Typography.H5 my={3}>New School</Typography.H5>
        <Input
          sx={{ width: "100%" }}
          label="School Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          mb={3}
        />
        <Flex>
          <Button
            type="button"
            variant="outline"
            mr={3}
            onClick={() => navigate("/choose-school")}
            sx={{ flexGrow: 1 }}
          >
            <Trans>Cancel</Trans>
          </Button>
          <Button variant="primaryBig" sx={{ flexGrow: 1 }}>
            <Trans>Save</Trans>
          </Button>
        </Flex>
      </Box>
    </Flex>
  )
}

export default PageNewSchool
