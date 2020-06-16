import React, { FC, FormEvent, useState } from "react"
import { Flex, Box, Button } from "theme-ui"
import { Link } from "../Link/Link"

import { Typography } from "../Typography/Typography"
import Input from "../Input/Input"
import Icon from "../Icon/Icon"
import { ReactComponent as AlertIcon } from "../../icons/alert.svg"
import { ReactComponent as CheckmarkIcon } from "../../icons/checkmark.svg"

import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import { doPasswordResetApi } from "../../api/doPasswordResetApi"
import { getAnalytics } from "../../analytics"
import Spacer from "../Spacer/Spacer"

interface Props {
  token: string
}
export const PageResetPassword: FC<Props> = ({ token }) => {
  const [password, setPassword] = useState("")
  const [retypePassword, setRetypePassword] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isFormDisabled = success || loading

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault()
    // reset state
    setLoading(true)
    setError("")

    // Validate fields
    if (!password) {
      setError("New password can't be empty")
      setLoading(false)
      return
    }
    if (!retypePassword) {
      setError("Retyped password can't be empty")
      setLoading(false)
      return
    }
    if (retypePassword !== password) {
      setError("Your retyped password doesn't match.")
      setLoading(false)
      return
    }

    // Do the password reset
    const response = await doPasswordResetApi(token, password)
    if (response.status === 200) {
      setSuccess(true)
      getAnalytics()?.track("Password reset success")
    } else {
      const body = await response.json()
      setError(body?.error?.message ?? "Something went wrong, please try again")
      getAnalytics()?.track("Password reset failed")
    }

    setLoading(false)
  }

  return (
    <Flex
      sx={{
        justifyContent: "center",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
      pt={3}
    >
      <Box
        as="form"
        p={3}
        sx={{ maxWidth: "maxWidth.sm", width: "100%" }}
        onSubmit={handleSubmit}
      >
        <Typography.H2 my={3}>Reset Password</Typography.H2>
        {!success && (
          <Typography.Body
            sx={{
              fontSize: 2,
            }}
            my={3}
            color="textMediumEmphasis"
          >
            Type in your new password and we&apos;ll get you up and running in
            no time :)
          </Typography.Body>
        )}

        {success && (
          <>
            <Flex
              my={3}
              py={2}
              px={3}
              backgroundColor="primaryLighter"
              sx={{
                alignItems: "center",
                borderWidth: 1,
                borderColor: "warning",
                borderRadius: "default",
              }}
            >
              <Icon
                sx={{ alignSelf: "flex-start" }}
                as={CheckmarkIcon}
                m={1}
                ml={0}
                fill="textPrimary"
              />
              <Typography.Body
                color="textPrimary"
                sx={{
                  width: "100%",
                  fontSize: 1,
                }}
                ml={1}
              >
                Password reset successful. You can try logging in with your new
                password.
              </Typography.Body>
            </Flex>
            <Flex>
              <Spacer />
              <Link to="/login">
                <Button variant="outline">
                  Login
                  <Icon as={NextIcon} m={0} mr={1} fill="textPrimary" />
                </Button>
              </Link>
            </Flex>
          </>
        )}

        {!success && (
          <>
            <Input
              sx={{ width: "100%" }}
              label="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              mb={2}
              type="password"
              disabled={isFormDisabled}
            />
            <Input
              sx={{ width: "100%" }}
              label="Retype New Password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              required
              mb={3}
              type="password"
              disabled={isFormDisabled}
            />
            {error && (
              <Flex
                backgroundColor="tintError"
                sx={{ alignItems: "center", borderRadius: "default" }}
                my={3}
                py={2}
                px={3}
              >
                <Icon
                  sx={{ alignSelf: "flex-start" }}
                  as={AlertIcon}
                  m={2}
                  ml={0}
                  mr={2}
                  fill="onTintError"
                />
                <Typography.Body
                  sx={{
                    fontSize: 1,
                    width: "100%",
                  }}
                  color="onTintError"
                >
                  {error}
                </Typography.Body>
              </Flex>
            )}
            <Button
              variant="primaryBig"
              sx={{ width: "100%" }}
              disabled={isFormDisabled}
            >
              {loading && <LoadingIndicator color="onPrimary" />}
              Reset
            </Button>
          </>
        )}
      </Box>
    </Flex>
  )
}

export default PageResetPassword
