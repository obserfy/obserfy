import { t, Trans } from "@lingui/macro"
import React, { FC, useState } from "react"
import { Box, Button, Card, Flex, useColorMode } from "theme-ui"
import dayjs from "../../dayjs"
import { useGetSchool } from "../../hooks/api/schools/useGetSchool"
import { useGetUserProfile } from "../../hooks/api/useGetUserProfile"
import { ReactComponent as CheckmarkIcon } from "../../icons/checkmark-outline.svg"
import { ReactComponent as CancelIcon } from "../../icons/close.svg"
import { ReactComponent as CreditCardIcon } from "../../icons/credit-card.svg"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { ADMIN_URL } from "../../routes"
import Icon from "../Icon/Icon"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
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
          breadCrumb(t`Subscription`),
        ]}
      />

      {school.data?.subscription ? (
        <Card m={3} px={4} sx={{ borderRadius: 16 }}>
          <Flex my={4} sx={{ alignItems: "center" }}>
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
              <Trans>Next Bill</Trans>
            </Typography.Body>
            <Typography.Body>
              {dayjs(school.data?.subscription?.nextBillDate).format(
                "ddd, DD MMMM YYYY"
              )}
            </Typography.Body>
          </Box>
          <Box mt={3} mb={3}>
            <Typography.Body
              sx={{ fontSize: 1, color: "textMediumEmphasis", lineHeight: 1 }}
            >
              <Trans>Amount Due</Trans>
            </Typography.Body>
            <Typography.Body>
              ${4 * school.data?.users?.length} ({school.data?.users?.length}{" "}
              users)
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
              <Typography.Body ml={3} sx={{ lineHeight: 1 }}>
                <Trans>Payment details</Trans>
              </Typography.Body>
              <Icon as={NextIcon} ml="auto" />
            </Flex>
          </a>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href={school.data?.subscription.cancelUrl}>
            <Flex py={3} mb={3} sx={{ alignItems: "center" }}>
              <Icon as={CancelIcon} size={24} fill="danger" />
              <Typography.Body ml={3} sx={{ lineHeight: 1 }}>
                <Trans>Cancel Plan</Trans>
              </Typography.Body>
              <Icon as={NextIcon} ml="auto" />
            </Flex>
          </a>
        </Card>
      ) : (
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
            <Trans>User/month</Trans>
          </Typography.Body>
        </Flex>

        <Box my={3}>
          <Feature text={t`Unlimited students`} />
          <Feature text={t`Record observations`} />
          <Feature text={t`Create lesson plans`} />
          <Feature text={t`Track curriculum progress`} />
          <Feature text={t`Parent portal`} />
          <Feature text={t`Image gallery`} />
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
                  "Qty and price will be updated later based on your school's user count.",
                successCallback: () => {
                  school.refetch()
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
            <Trans>Subscribe</Trans>
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
