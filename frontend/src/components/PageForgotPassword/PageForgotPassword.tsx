import React, { FC, FormEvent, useState } from "react"
import { Link } from "gatsby-plugin-intl3"
import Box from "../Box/Box"
import { Typography } from "../Typography/Typography"
import Input from "../Input/Input"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import { ReactComponent as CheckmarkIcon } from "../../icons/checkmark.svg"
import { ReactComponent as BackIcon } from "../../icons/arrow-back.svg"
import { ReactComponent as AlertIcon } from "../../icons/alert.svg"
import Icon from "../Icon/Icon"
import { mailPasswordResetApi } from "../../api/mailPasswordResetApi"

function validateEmail(email: string): boolean {
  return email !== ""
}

export const PageForgotPassword: FC = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault()
    // validate email
    const isEmailValid = validateEmail(email)
    if (!isEmailValid) {
      setError("Invalid email address")
      return
    }

    // Reset state
    setLoading(true)
    setSuccess(false)
    setError("")

    // Make the request
    const response = await mailPasswordResetApi(email)
    if (response.status === 200) {
      setSuccess(true)
    } else {
      setSuccess(false)
      setError("Failed requesting password reset, please try again.")
    }
    setLoading(false)
  }

  return (
    <Flex justifyContent="center" minHeight="100vh" minWidth="100vw" pt={3}>
      <Box
        as="form"
        p={3}
        maxWidth="maxWidth.sm"
        width="100%"
        onSubmit={handleSubmit}
      >
        <Typography.H2 my={3}>Forgot Password</Typography.H2>
        <Typography.Body fontSize={2} my={4}>
          Can&apos;t remember your password? No problem, tell us your email
          address and we&apos;ll help you reset it.
        </Typography.Body>
        <Input
          width="100%"
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          mb={3}
          disabled={success}
          type="email"
        />
        {error && (
          <Flex
            alignItems="center"
            backgroundColor="tintError"
            sx={{ borderRadius: "default" }}
            my={3}
            py={2}
            px={3}
          >
            <Icon
              alignSelf="flex-start"
              as={AlertIcon}
              m={1}
              ml={0}
              mr={2}
              fill="onTintError"
            />
            <Typography.Body width="100%" fontSize={1} color="onTintError">
              {error}
            </Typography.Body>
          </Flex>
        )}
        {success && (
          <>
            <Flex
              alignItems="center"
              my={3}
              py={2}
              px={3}
              backgroundColor="primaryLighter"
              sx={{
                borderWidth: 1,
                borderColor: "warning",
                borderRadius: "default",
              }}
            >
              <Icon
                alignSelf="flex-start"
                as={CheckmarkIcon}
                m={1}
                ml={0}
                fill="textPrimary"
              />
              <Typography.Body
                width="100%"
                color="textPrimary"
                fontSize={1}
                ml={1}
              >
                We&apos;ve sent an email to you. Please check your inbox :)
              </Typography.Body>
            </Flex>
            <Link to="/login">
              <Button variant="outline">
                <Icon as={BackIcon} m={0} mr={1} fill="textPrimary" />
                Go Back
              </Button>
            </Link>
          </>
        )}
        {!success && (
          <Flex>
            <Link to="/login" style={{ width: "100%" }}>
              <Button type="button" variant="outlineBig" width="100%">
                Login
              </Button>
            </Link>
            <Button variant="primaryBig" width="100%" ml={3}>
              {loading && <LoadingIndicator color="onPrimary" />}
              Reset
            </Button>
          </Flex>
        )}
      </Box>
    </Flex>
  )
}

export default PageForgotPassword
