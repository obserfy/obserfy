import { FC, Fragment, useState } from "react"
import { Box, Button, Flex } from "theme-ui"
import { Link } from "../Link/Link"
import { Typography } from "../Typography/Typography"
import Input from "../Input/Input"

import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import { ReactComponent as CheckmarkIcon } from "../../icons/checkmark.svg"
import { ReactComponent as BackIcon } from "../../icons/arrow-back.svg"
import { ReactComponent as AlertIcon } from "../../icons/alert.svg"
import Icon from "../Icon/Icon"
import BrandBanner from "../BrandBanner/BrandBanner"
import usePostResetPasswordEmail from "../../hooks/api/usePostResetPasswordEmail"

export const PageForgotPassword: FC = () => {
  const [email, setEmail] = useState("")
  const { mutateAsync, error, isLoading, isSuccess } =
    usePostResetPasswordEmail()

  return (
    <Box>
      <BrandBanner />
      <Box
        mx="auto"
        as="form"
        px={3}
        sx={{ maxWidth: "maxWidth.xsm", width: "100%" }}
        onSubmit={async (event) => {
          try {
            event.preventDefault()
            await mutateAsync(email)
          } catch (e) {
            Sentry.captureException(e)
          }
        }}
      >
        <Typography.H5 sx={{ fontWeight: "bold" }} my={3}>
          Reset Password
        </Typography.H5>
        <Typography.Body sx={{ fontSize: 2 }} my={4}>
          Can&apos;t remember your password? No problem, type your email address
          and we&apos;ll help you reset it.
        </Typography.Body>
        <Input
          sx={{ width: "100%" }}
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          mb={3}
          disabled={isSuccess}
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
              {(error as Error).message}
            </Typography.Body>
          </Flex>
        )}
        {isSuccess ? (
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
                <Icon as={BackIcon} mr={1} fill="textPrimary" />
                Go Back
              </Button>
            </Link>
          </Fragment>
        ) : (
          <Fragment>
            <Button sx={{ width: "100%" }}>
              {isLoading && <LoadingIndicator color="onPrimary" />}
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
