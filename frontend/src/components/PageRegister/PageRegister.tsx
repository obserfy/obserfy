import React, { FC, FormEvent, useState } from "react"
import { navigate } from "gatsby"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import { Typography } from "../Typography/Typography"
import Input from "../Input/Input"
import Button from "../Button/Button"

async function submitRegisterForm(
  email: string,
  password: string,
  name: string
): Promise<void> {
  const credentials = new FormData()
  credentials.append("email", email)
  credentials.append("password", password)
  credentials.append("name", name)
  const response = await fetch("/auth/register", {
    method: "POST",
    credentials: "same-origin",
    body: credentials,
  })
  if (response.status === 200) navigate("/choose-school")
}

export const PageRegister: FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  function handleSubmit(e: FormEvent): void {
    submitRegisterForm(email, password, name)
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
        <Typography.H2 my={3}>Register</Typography.H2>
        <Input
          type="email"
          name="email"
          width="100%"
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          mb={2}
        />
        <Input
          width="100%"
          name="name"
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          mb={2}
        />
        <Input
          type="password"
          name="password"
          width="100%"
          label="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          mb={3}
        />
        <Flex>
          <Button
            type="button"
            variant="outline"
            width="100%"
            mr={3}
            onClick={() => navigate("/login")}
          >
            Log In
          </Button>
          <Button variant="primaryBig" width="100%">
            Sign Up
          </Button>
        </Flex>
      </Box>
    </Flex>
  )
}

export default PageRegister
