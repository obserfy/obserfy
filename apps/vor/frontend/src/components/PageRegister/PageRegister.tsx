/** @jsx jsx */
import { FC, useState, Fragment } from "react"
import { Box, Button, Card, Flex, jsx } from "theme-ui"
import { useMutation, useQuery } from "react-query"
import { Typography } from "../Typography/Typography"
import Input from "../Input/Input"
import BrandBanner from "../BrandBanner/BrandBanner"
import { Link, navigate } from "../Link/Link"
import Icon from "../Icon/Icon"
import { ReactComponent as InfoIcon } from "../../icons/info.svg"
import usePostRegister from "../../api/usePostRegister"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import useGetInviteCodeDetails from "../../api/useGetInviteCodeDetails"
import { BASE_URL } from "../../api/useApi"
import { postApi } from "../../api/fetchApi"

const useGetUser = () => {
  const getUser = async () => {
    const result = await fetch(`${BASE_URL}/users`)
    if (result.status === 401) {
      return {
        isLoggedIn: false,
      }
    }
    if (!result.ok) {
      throw new Error("failed to fetch user data")
    }
    const response = await result.json()
    return {
      ...response,
      isLoggedIn: true,
    }
  }

  return useQuery(["users"], getUser)
}

const usePostRegisterUserToSchool = () => {
  const postRegisterSchool = postApi<{ inviteCode: string }>(`/users/schools`)
  return useMutation(postRegisterSchool)
}

interface Props {
  inviteCode?: string
}
export const PageRegister: FC<Props> = ({ inviteCode }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const inviteCodeDetails = useGetInviteCodeDetails(inviteCode)
  const [postRegister, { error, isLoading }] = usePostRegister()
  const user = useGetUser()
  const [
    postRegisterUserToSchool,
    registerUserToSchool,
  ] = usePostRegisterUserToSchool()

  return (
    <Box>
      <BrandBanner />
      {inviteCodeDetails.isSuccess && (
        <Box
          sx={{ width: "100%", maxWidth: "maxWidth.xsm" }}
          mx="auto"
          px={3}
          pb={4}
        >
          <Card
            p={3}
            sx={{
              borderBottomColor: "primary",
              borderBottomStyle: "solid",
              borderBottomWidth: 2,
            }}
          >
            <Typography.Body>You&apos;ve been invited to join</Typography.Body>
            <Typography.H5 py={2} sx={{ fontWeight: "bold" }}>
              {inviteCodeDetails.data?.schoolName}
              <span role="img" aria-label="Party emoji">
                {" "}
                🎊 🎉
              </span>
            </Typography.H5>
          </Card>
          {user.data?.isLoggedIn && inviteCode && (
            <Button
              mt={3}
              sx={{ width: "100%" }}
              onClick={async () => {
                const result = await postRegisterUserToSchool({
                  inviteCode,
                })
                if (result?.ok) {
                  await navigate("/choose-school")
                }
              }}
            >
              {registerUserToSchool.isLoading ? (
                <LoadingIndicator />
              ) : (
                `Join as ${user.data?.name}`
              )}
            </Button>
          )}
        </Box>
      )}
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
        {(!user.data?.isLoggedIn || !inviteCode) && (
          <Fragment>
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
              {isLoading && <LoadingIndicator />}
              Sign Up
            </Button>
            <Typography.Body
              my={3}
              sx={{ textAlign: "center", width: "100%" }}
              color="danger"
            >
              {(error as Error)?.message}
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
              <Icon as={InfoIcon} fill="primaryDark" />
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
          </Fragment>
        )}
      </Box>
    </Box>
  )
}

export default PageRegister
