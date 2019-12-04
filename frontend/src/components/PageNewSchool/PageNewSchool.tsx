import React, { FC, FormEvent, useState } from "react"
import { navigate } from "gatsby"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import { Typography } from "../Typography/Typography"
import Input from "../Input/Input"
import Button from "../Button/Button"

async function submitNewSchoolForm(name: string): Promise<void> {
  const data = { name }
  const response = await fetch("/api/v1/schools", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (response.status === 200) navigate("/choose-school")
}

export const PageNewSchool: FC = () => {
  const [name, setName] = useState()

  function handleSubmit(e: FormEvent): void {
    submitNewSchoolForm(name)
    e.preventDefault()
  }

  return (
    <Flex justifyContent="center" minHeight="100vh" minWidth="100vw" pt={6}>
      <Box
        as="form"
        p={3}
        maxWidth="maxWidth.sm"
        width="100%"
        onSubmit={handleSubmit}
        mt={-5}
      >
        <Typography.H2 my={3}>New School</Typography.H2>
        <Input
          onEnterPressed={handleSubmit}
          width="100%"
          label="School Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          mb={3}
        />
        <Flex>
          <Button
            type="button"
            variant="outline"
            width="100%"
            mr={3}
            onClick={() => navigate("/choose-school")}
          >
            Cancel
          </Button>
          <Button variant="primaryBig" width="100%">
            Save
          </Button>
        </Flex>
      </Box>
    </Flex>
  )
}

export default PageNewSchool
