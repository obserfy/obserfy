import React, { FC, FormEvent, useEffect, useState } from "react"
import { navigate } from "gatsby"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import { Typography } from "../Typography/Typography"
import Input from "../Input/Input"
import Button from "../Button/Button"
import Card from "../Card/Card"

interface Props {
  inviteCode?: string
}
export const PageRegister: FC<Props> = ({ inviteCode }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [inviter, setSchoolInviter] = useState<string>()
  const [error, setError] = useState("")

  useEffect(() => {
    const f = async (): Promise<void> => {
      const response = await fetch(`/auth/invite-code/${inviteCode}`)
      if (response.status === 200) {
        const schoolData = await response.json()
        setSchoolInviter(schoolData.schoolName)
      }
    }
    f()
  }, [inviteCode])

  async function submitRegisterForm(): Promise<void> {
    const credentials = new FormData()
    credentials.append("email", email)
    credentials.append("password", password)
    credentials.append("name", name)
    credentials.append("inviteCode", inviteCode ?? "")
    const response = await fetch("/auth/register", {
      method: "POST",
      credentials: "same-origin",
      body: credentials,
    })
    if (response.status === 200) {
      navigate("/choose-school")
    } else if (response.status === 409) {
      setError("Email has already been used to register")
    }
  }

  function handleSubmit(e: FormEvent): void {
    submitRegisterForm()
    e.preventDefault()
  }

  return (
    <Flex
      justifyContent="center"
      minHeight="100vh"
      minWidth="100vw"
      pt={[0, 6]}
    >
      <Box
        as="form"
        p={3}
        maxWidth="maxWidth.sm"
        width="100%"
        onSubmit={handleSubmit}
        mt={[0, -5]}
      >
        {inviter && (
          <Card
            p={3}
            mb={4}
            sx={{
              borderBottomColor: "green",
              borderBottomStyle: "solid",
              borderBottomWidth: 2,
            }}
          >
            <Typography.Body>You&apos;ve been invited to join</Typography.Body>
            <Typography.H4>
              {inviter}
              <span role="img" aria-label="Party emoji">
                {" "}
                🎊 🎉
              </span>
            </Typography.H4>
          </Card>
        )}
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
        <Typography.Body
          mb={3}
          width="100%"
          textAlign="center"
          color="danger"
          fontWeight="bold"
        >
          {error}
        </Typography.Body>
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
