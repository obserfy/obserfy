import React, { FC, FormEvent, useState } from "react"
import { Link } from "gatsby-plugin-intl3"
import Box from "../Box/Box"
import { Typography } from "../Typography/Typography"
import Input from "../Input/Input"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"

export const PageForgotPassword: FC = () => {
  const [email, setEmail] = useState("")

  async function handleSubmit(e: FormEvent): Promise<void> {
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
        <Typography.H2 my={3}>Reset Password</Typography.H2>
        <Input
          width="100%"
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          mb={2}
        />
        <Flex>
          <Link to="/login" style={{ width: "100%" }}>
            <Button type="button" variant="outlineBig" width="100%">
              Login
            </Button>
          </Link>
          <Button variant="primaryBig" width="100%" ml={3}>
            Reset
          </Button>
        </Flex>
      </Box>
    </Flex>
  )
}

export default PageForgotPassword
