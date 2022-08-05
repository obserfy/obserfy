import { t, Trans } from "@lingui/macro"
import { FC, useState } from "react"
import { Box, Button, Card, Flex, useColorMode } from "theme-ui"
import { borderTop } from "../../border"
import dayjs from "../../dayjs"
import { useGetSchool } from "../../hooks/api/schools/useGetSchool"
import { useGetUserProfile } from "../../hooks/api/useGetUserProfile"
import { ReactComponent as CheckmarkIcon } from "../../icons/checkmark-outline.svg"
import { ReactComponent as CancelIcon } from "../../icons/close.svg"
import { ReactComponent as CreditCardIcon } from "../../icons/credit-card.svg"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import {
  ADMIN_SUBSCRIPTION_SUCCESS_URL,
  ADMIN_URL,
  ADMIN_USERS_URL,
} from "../../routes"
import Icon from "../Icon/Icon"
import { Link, navigate } from "../Link/Link"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import Typography from "../Typography/Typography"

export const PageSubscription: FC = () => {
  const [loading, setLoading] = useState(false)
  const user = useGetUserProfile()
  const school = useGetSchool()
  const [colorMode] = useColorMode()
  const isSubscribed = school.data?.subscription

  return (
    <Box mx="auto" sx={{ maxWidth: "maxWidth.xsm" }}>
      <TopBar
        breadcrumbs={[
          breadCrumb(t`Admin`, ADMIN_URL),
          breadCrumb(t`Plans & Billing`),
        ]}
      />

      {school.data?.subscription && (
        <Card m={3} px={4} sx={{ borderRadius: 16 }}>
          <Flex pt={4} pb={3} sx={{ alignItems: "center" }}>
            <Typography.Body
              color="textPrimary"
              sx={{ fontWeight: "bold", lineHeight: 1 }}
            >
              <Trans>Standard</Trans>
            </Typography.Body>
            <Typography.Body ml="auto">
              <Trans>Current Plan</Trans>
            </Typography.Body>
          </Flex>
          <Box mt={3}>
            <Typography.Body
              sx={{ fontSize: 1, color: "textMediumEmphasis", lineHeight: 1 }}
            >
              <Trans>Next billing date</Trans>
            </Typography.Body>
            <Typography.Body>
              {dayjs(school.data?.subscription?.nextBillDate).format(
                "D MMMM YYYY"
              )}
            </Typography.Body>
          </Box>
          <Box mt={3} mb={3}>
            <Typography.Body
              sx={{ fontSize: 1, color: "textMediumEmphasis", lineHeight: 1 }}
            >
              <Trans>Price</Trans>
            </Typography.Body>
            <Typography.Body>
              ${4 * school.data?.users?.length} ({school.data?.users?.length}{" "}
              users) / month
            </Typography.Body>
          </Box>

          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href={school.data?.subscription.updateUrl}>
            <Flex py={3} sx={{ alignItems: "center" }}>
              <Icon
                as={CreditCardIcon}
                size={24}
                color="textPrimary"
                fill="transparent"
              />
              <Typography.Body ml={3}>
                <Trans>Payment details</Trans>
              </Typography.Body>
              <Icon as={NextIcon} ml="auto" />
            </Flex>
          </a>

          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href={school.data?.subscription.cancelUrl}>
            <Flex py={3} pb={4} sx={{ alignItems: "center" }}>
              <Icon as={CancelIcon} size={24} fill="danger" />
              <Typography.Body ml={3}>
                <Trans>Cancel Plan</Trans>
              </Typography.Body>
              <Icon as={NextIcon} ml="auto" />
            </Flex>
          </a>
        </Card>
      )}

      {school.isSuccess && !school.data?.subscription && (
        <Card m={3} px={4} sx={{ borderRadius: 16 }}>
          <Flex py={4} sx={{ alignItems: "center" }}>
            <Typography.Body color="textPrimary" sx={{ fontWeight: "bold" }}>
              <Trans>Free Trial</Trans>
            </Typography.Body>
            <Typography.Body ml="auto">
              <Trans>Current Plan</Trans>
            </Typography.Body>
          </Flex>
        </Card>
      )}

      {school.isLoading && (
        <Box px={3} pt={3}>
          <LoadingPlaceholder
            sx={{ width: "100%", height: "16rem", borderRadius: 16 }}
          />
        </Box>
      )}

      <Card m={3} p={4} mt={3} sx={{ borderRadius: 16 }}>
        <Typography.Body
          color="textPrimary"
          sx={{ fontWeight: "bold", lineHeight: 1 }}
          mb={2}
        >
          <Trans>Standard Plan</Trans>
        </Typography.Body>

        <Flex sx={{ alignItems: "baseline" }}>
          <Typography.H3 sx={{ fontWeight: "bold", lineHeight: 1 }}>
            $4
          </Typography.H3>
          <Typography.Body ml={2} color="textMediumEmphasis">
            <Trans>User / Month</Trans>
          </Typography.Body>
        </Flex>

        <Typography.Body my={3}>
          <Trans>Get full access to all features.</Trans>{" "}
          <a href="https://obserfy.com/pricing">
            <u>
              <Trans>Learn more.</Trans>
            </u>
          </a>
        </Typography.Body>

        <Box my={3}>
          <Feature text={t`Unlimited students`} />
          <Feature text={t`Record observations`} />
          <Feature text={t`Create lesson plans`} />
          <Feature text={t`Track curriculum progress`} />
          <Feature text={t`Parent dashboard`} />
          <Feature text={t`Image gallery`} />
          <Feature text={t`Video gallery`} />
        </Box>

        <Box mt={3} mb={3} sx={{ ...borderTop }} pt={3}>
          <Flex>
            <Typography.Body>You currently have</Typography.Body>
            <Link
              to={ADMIN_USERS_URL}
              sx={{ fontSize: 1, textDecoration: "underline", ml: "auto" }}
            >
              <Trans>Manage users</Trans>
            </Link>
          </Flex>
          <Typography.Body sx={{ opacity: school.data ? 1 : 0.5 }}>
            {school.data?.users.length ?? "... "} User(s)
          </Typography.Body>
        </Box>

        <Box>
          <Typography.Body sx={{ fontWeight: "bold" }}>Total</Typography.Body>
          <Typography.Body
            ml="auto"
            sx={{ fontWeight: "bold", opacity: school.data ? 1 : 0.5 }}
          >
            {school.data ? school.data?.users.length * 4 : "... "}$ / month
          </Typography.Body>
        </Box>

        <Button
          variant={isSubscribed ? "outline" : "primary"}
          mt={4}
          p={3}
          sx={{ width: "100%", fontWeight: "bold", borderRadius: 16 }}
          disabled={
            user.isLoading || school.isLoading || isSubscribed !== undefined
          }
          onClick={() => {
            setLoading(true)
            const script = document.createElement("script")
            script.type = "text/javascript"
            script.onload = () => {
              setLoading(false)
              Paddle.Setup({ vendor: 112134 })
              Paddle.Checkout.open({
                product: 590592,
                email: user.data?.email,
                passthrough: JSON.stringify({ schoolId: user.data?.school.id }),
                allowQuantity: false,
                displayModeTheme: colorMode === "dark" ? "dark" : "light",
                quantity: school.data?.users?.length ?? 1,
                message:
                  "Quantity and price will be adjusted later based on your school's user count.",
                successCallback: () => {
                  setTimeout(() => {
                    navigate(ADMIN_SUBSCRIPTION_SUCCESS_URL)
                  }, 500)
                },
              })
            }
            script.src = "https://cdn.paddle.com/paddle/paddle.js"
            document.getElementsByTagName("head")[0].appendChild(script)
          }}
        >
          {/* eslint-disable-next-line no-nested-ternary */}
          {isSubscribed ? (
            <Trans>Subscribed</Trans>
          ) : loading || user.isLoading ? (
            <LoadingIndicator color="onPrimary" />
          ) : (
            <Trans>Subscribe Now</Trans>
          )}
        </Button>
      </Card>
    </Box>
  )
}

const Feature: FC<{ text: string; comingSoon?: boolean }> = ({
  text,
  comingSoon,
}) => {
  return (
    <Flex sx={{ alignItems: "center" }}>
      <Icon as={CheckmarkIcon} fill="textPrimary" />
      <Typography.Body ml={2}>
        <Trans id={text} />
      </Typography.Body>
      {comingSoon && (
        <Typography.Body ml={2} color="textPrimary">
          <Trans>Soon</Trans>
        </Typography.Body>
      )}
    </Flex>
  )
}

export default PageSubscription
