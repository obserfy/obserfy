import React, { FC, FormEvent, useState } from "react"
import { navigate } from "gatsby"
import Box from "../Box/Box"
import Input from "../Input/Input"
import Button from "../Button/Button"
import Flex from "../Flex/Flex"
import { Typography } from "../Typography/Typography"

async function submitLoginForm(email: string, password: string): Promise<void> {
  const credentials = new FormData()
  credentials.append("email", email)
  credentials.append("password", password)
  const response = await fetch("/auth/login", {
    method: "POST",
    credentials: "same-origin",
    body: credentials,
  })
  if (response.status === 200) navigate("/")
}

export const PageLogin: FC = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  function handleSubmit(e: FormEvent): void {
    submitLoginForm(email, password)
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
      >
        <Typography.H1 my={3}>Welcome</Typography.H1>
        <Input
          width="100%"
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          mb={3}
        />
        <Input
          type="password"
          width="100%"
          label="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          mb={3}
        />
        <Button variant="primaryBig" width="100%">
          Login
        </Button>
      </Box>
    </Flex>
  )
}

export default PageLogin
