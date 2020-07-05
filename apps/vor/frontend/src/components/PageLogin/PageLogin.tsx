import React, { FC, FormEvent, useState } from "react"
import { navigate } from "gatsby"
import { Box, Button, Flex } from "theme-ui"
import Input from "../Input/Input"

import { Link } from "../Link/Link"
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
        <Typography.H2 my={3}>Welcome</Typography.H2>
        <Input
          sx={{ width: "100%" }}
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          mb={2}
        />
        <Input
          type="password"
          sx={{ width: "100%" }}
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Link to="/forgot-password">
          <Typography.Body
            sx={{
              fontSize: 1,
              textDecoration: "underline",
            }}
            my={2}
          >
            Forgot password?
          </Typography.Body>
        </Link>
        <Flex>
          <Button
            type="button"
            variant="outline"
            sx={{ width: "100%" }}
            mr={3}
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
          <Button variant="primaryBig" sx={{ width: "100%" }}>
            Login
          </Button>
        </Flex>
        <Typography.Body
          my={3}
          color="danger"
          sx={{
            textAlign: "center",
            fontSize: 1,
            width: "100%",
            fontWeight: "bold",
          }}
        >
          {error}
        </Typography.Body>
      </Box>
    </Flex>
  )
}

export default PageLogin
