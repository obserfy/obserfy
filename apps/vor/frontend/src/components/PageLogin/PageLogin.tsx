/** @jsx jsx */
import { FC, useState } from "react"
import { Box, Button, Flex, jsx } from "theme-ui"
import Input from "../Input/Input"
import { Link } from "../Link/Link"
import { Typography } from "../Typography/Typography"
import Icon from "../Icon/Icon"
import { ReactComponent as InfoIcon } from "../../icons/info.svg"
import BrandBanner from "../BrandBanner/BrandBanner"
import usePostLogin from "../../api/usePostLogin"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

export const PageLogin: FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mutate, { error, isLoading }] = usePostLogin()

  return (
    <Box>
      <BrandBanner />

      <Flex sx={{ justifyContent: "center" }}>
        <Box
          as="form"
          px={3}
          sx={{ width: "100%", maxWidth: "maxWidth.xsm" }}
          onSubmit={async (e) => {
            e.preventDefault()
            await mutate({ email, password })
          }}
        >
          <Typography.H5 sx={{ fontWeight: "bold" }} my={3}>
            Login
          </Typography.H5>
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

          <Button my={3} sx={{ width: "100%" }}>
            {isLoading ? <LoadingIndicator /> : "Login"}
          </Button>
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
            {error ? "Wrong email or password" : ""}
          </Typography.Body>
          <Typography.Body
            color="textMediumEmphasis"
            sx={{ textAlign: "center" }}
          >
            <Link to="/forgot-password" sx={{ color: "textPrimary" }}>
              Forgot password
            </Link>
          </Typography.Body>
          <Typography.Body
            mt={5}
            color="textMediumEmphasis"
            sx={{ textAlign: "center" }}
          >
            Don&apos;t have an account?{" "}
            <Link to="/register" sx={{ color: "textPrimary" }}>
              Sign Up
            </Link>
          </Typography.Body>
        </Box>
      </Flex>
      <Box mx="auto" p={3} sx={{ maxWidth: "maxWidth.xsm" }}>
        <Flex
          p={3}
          backgroundColor="primaryLighter"
          sx={{
            borderRadius: "default",
            alignItems: "center",
          }}
        >
          <Icon as={InfoIcon} m={0} fill="primaryDark" />
          <Typography.Body sx={{ fontSize: 1, lineHeight: 1.4 }} ml={2}>
            Are you a parent?{" "}
            <a
              href="https://parent.obserfy.com/api/login"
              sx={{ color: "textPrimary" }}
            >
              Go to parent portal
            </a>
          </Typography.Body>
        </Flex>
      </Box>
    </Box>
  )
}

export default PageLogin
