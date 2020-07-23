/** @jsx jsx */
import { FC, FormEvent, useState, Fragment } from "react"
import { jsx, Box, Flex, Button } from "theme-ui"
import { Link } from "../Link/Link"
import { Typography } from "../Typography/Typography"
import Input from "../Input/Input"

import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import { ReactComponent as CheckmarkIcon } from "../../icons/checkmark.svg"
import { ReactComponent as BackIcon } from "../../icons/arrow-back.svg"
import { ReactComponent as AlertIcon } from "../../icons/alert.svg"
import Icon from "../Icon/Icon"
import { mailPasswordResetApi } from "../../api/mailPasswordResetApi"
import BrandBanner from "../BrandBanner/BrandBanner"

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
    <Box>
      <BrandBanner />
      <Box
        mx="auto"
        as="form"
        p={3}
        sx={{ maxWidth: "maxWidth.xsm", width: "100%" }}
        onSubmit={handleSubmit}
      >
        <Typography.H5 sx={{ fontWeight: "bold" }} my={3}>
          Reset Password
        </Typography.H5>
        <Typography.Body sx={{ fontSize: 2 }} my={4}>
          Can&apos;t remember your password? No problem, type email address and
          we&apos;ll help you reset it.
        </Typography.Body>
        <Input
          sx={{ width: "100%" }}
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          mb={3}
          disabled={success}
          type="email"
        />
        {error && (
          <Flex
            sx={{ borderRadius: "default", alignItems: "center" }}
            backgroundColor="tintError"
            my={3}
            py={2}
            px={3}
          >
            <Icon as={AlertIcon} m={1} ml={0} mr={2} fill="onTintError" />
            <Typography.Body
              sx={{
                alignSelf: "flex-start",
                fontSize: 1,
                width: "100%",
              }}
              color="onTintError"
            >
              {error}
            </Typography.Body>
          </Flex>
        )}
        {success ? (
          <Fragment>
            <Flex
              mb={3}
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
                sx={{ width: "100%", fontSize: 1 }}
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
          </Fragment>
        ) : (
          <Fragment>
            <Button sx={{ width: "100%" }}>
              {loading && <LoadingIndicator color="onPrimary" />}
              Reset Password
            </Button>
            <Typography.Body
              mt={3}
              color="textMediumEmphasis"
              sx={{ textAlign: "center" }}
            >
              <Link to="/login" sx={{ color: "textPrimary" }}>
                Back to Login
              </Link>
            </Typography.Body>
          </Fragment>
        )}
      </Box>
    </Box>
  )
}

export default PageForgotPassword
