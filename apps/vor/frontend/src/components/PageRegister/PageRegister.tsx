/** @jsx jsx */
import { FC, useState } from "react"
import { Box, Button, Card, Flex, jsx } from "theme-ui"
import { Typography } from "../Typography/Typography"
import Input from "../Input/Input"
import BrandBanner from "../BrandBanner/BrandBanner"
import { Link } from "../Link/Link"
import Icon from "../Icon/Icon"
import { ReactComponent as InfoIcon } from "../../icons/info.svg"
import usePostRegister from "../../api/usePostRegister"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import useGetInviteCodeDetails from "../../api/useGetInviteCodeDetails"

interface Props {
  inviteCode?: string
}
export const PageRegister: FC<Props> = ({ inviteCode }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const inviteCodeDetails = useGetInviteCodeDetails(inviteCode)
  const [postRegister, { error, isLoading }] = usePostRegister()

  return (
    <Box>
      <BrandBanner />
      <Box
        mx="auto"
        as="form"
        px={3}
        sx={{ width: "100%", maxWidth: "maxWidth.xsm" }}
        onSubmit={(e) => {
          e.preventDefault()
          postRegister({ name, password, email, inviteCode })
        }}
      >
        {inviteCodeDetails.isSuccess && (
          <Card
            p={3}
            mb={4}
            sx={{
              borderBottomColor: "primary",
              borderBottomStyle: "solid",
              borderBottomWidth: 2,
            }}
          >
            <Typography.Body>You&apos;ve been invited to join</Typography.Body>
            <Typography.H4>
              {inviteCodeDetails.data.schoolName}
              <span role="img" aria-label="Party emoji">
                {" "}
                🎊 🎉
              </span>
            </Typography.H4>
          </Card>
        )}
        <Typography.H5 sx={{ fontWeight: "bold" }} my={3}>
          Sign Up
        </Typography.H5>
        <Input
          sx={{ width: "100%" }}
          name="name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          mb={2}
        />
        <Input
          data-cy="register-email"
          type="email"
          name="email"
          sx={{ width: "100%" }}
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          mb={2}
        />
        <Input
          type="password"
          name="password"
          sx={{ width: "100%" }}
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          mb={3}
        />
        <Button sx={{ width: "100%" }} data-cy="register-button">
          {isLoading ? <LoadingIndicator /> : "Sign Up"}
        </Button>
        <Typography.Body
          my={3}
          sx={{ textAlign: "center", width: "100%" }}
          color="danger"
        >
          {error?.message}
        </Typography.Body>
        <Typography.Body
          mt={5}
          color="textMediumEmphasis"
          sx={{ textAlign: "center" }}
        >
          Already have an account?{" "}
          <Link to="/login" sx={{ color: "textPrimary" }}>
            Login
          </Link>
        </Typography.Body>
        <Flex
          mt={3}
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

export default PageRegister
