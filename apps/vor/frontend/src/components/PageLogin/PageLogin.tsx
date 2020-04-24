import React, { FC, FormEvent, useState } from "react"
import { navigate } from "gatsby"
import { Link } from "../Link/Link"
import Box from "../Box/Box"
import Input from "../Input/Input"
import Button from "../Button/Button"
import Flex from "../Flex/Flex"
import { Typography } from "../Typography/Typography"
import { getAnalytics } from "../../analytics"

export const PageLogin: FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function submitLoginForm(): Promise<void> {
    setError("")
    const response = await fetch("/auth/login", {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({ email, password }),
    })
    if (response.status === 200) {
      await navigate("/choose-school")
      getAnalytics()?.track("User Login Success")
    } else {
      setError("Wrong email or password")
      getAnalytics()?.track("User Login Failed", {
        email,
        status: response.status,
      })
    }
  }

  function handleSubmit(e: FormEvent): void {
    submitLoginForm()
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
        <Typography.H2 my={3}>Welcome</Typography.H2>
        <Input
          width="100%"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          mb={2}
        />
        <Input
          type="password"
          width="100%"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Link to="/forgot-password">
          <Typography.Body
            fontSize={1}
            my={2}
            sx={{ textDecoration: "underline" }}
          >
            Forgot password?
          </Typography.Body>
        </Link>
        <Flex>
          <Button
            type="button"
            variant="outline"
            width="100%"
            mr={3}
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
          <Button variant="primaryBig" width="100%">
            Login
          </Button>
        </Flex>
        <Typography.Body
          my={3}
          width="100%"
          textAlign="center"
          color="danger"
          fontSize={1}
          fontWeight="bold"
        >
          {error}
        </Typography.Body>
      </Box>
    </Flex>
  )
}

export default PageLogin
