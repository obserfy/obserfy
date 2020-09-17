import React, { FC, useState } from "react"
import { Box, Button, Card, Flex, useColorMode } from "theme-ui"
import dayjs from "../../dayjs"
import Typography from "../Typography/Typography"
import BackNavigation from "../BackNavigation/BackNavigation"
import Icon from "../Icon/Icon"
import { ReactComponent as CheckmarkIcon } from "../../icons/checkmark-outline.svg"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import { useGetUserProfile } from "../../api/useGetUserProfile"
import { useGetSchool } from "../../api/schools/useGetSchool"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { ReactComponent as CancelIcon } from "../../icons/close.svg"
import { ReactComponent as CreditCardIcon } from "../../icons/credit-card.svg"

export const PageSubscription: FC = () => {
  const [loading, setLoading] = useState(false)
  const user = useGetUserProfile()
  const school = useGetSchool()
  const [colorMode] = useColorMode()
  const isSubscribed = school.data?.subscription

  return (
    <Box mx="auto" sx={{ maxWidth: "maxWidth.xsm" }}>
      <BackNavigation to="../" text="Admin" />
      <Typography.H4 sx={{ fontWeight: "bold", textAlign: "center" }} mb={4}>
        Subscription Plan
      </Typography.H4>
      {school.data?.subscription ? (
        <Card m={3} px={4} sx={{ borderRadius: 16 }}>
          <Flex my={4} sx={{ alignItems: "center" }}>
            <Typography.Body
              color="textPrimary"
              sx={{ fontWeight: "bold", lineHeight: 1 }}
            >
              Standard
            </Typography.Body>
            <Typography.Body ml="auto">Current Plan</Typography.Body>
          </Flex>
          <Box mt={3}>
            <Typography.Body
              sx={{ fontSize: 1, color: "textMediumEmphasis", lineHeight: 1 }}
            >
              Next Bill
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
              Amount Due
            </Typography.Body>
            <Typography.Body>
              ${3.99 * school.data?.users?.length} ({school.data?.users?.length}{" "}
              users)
            </Typography.Body>
          </Box>
          <a href={school.data?.subscription.updateUrl}>
            <Flex py={3} sx={{ alignItems: "center" }}>
              <Icon
                as={CreditCardIcon}
                size={24}
                color="textPrimary"
                fill="transparent"
              />
              <Typography.Body ml={3} sx={{ lineHeight: 1 }}>
                Payment details
              </Typography.Body>
              <Icon as={NextIcon} ml="auto" />
            </Flex>
          </a>
          <a href={school.data?.subscription.cancelUrl}>
            <Flex py={3} mb={3} sx={{ alignItems: "center" }}>
              <Icon as={CancelIcon} size={24} fill="danger" />
              <Typography.Body ml={3} sx={{ lineHeight: 1 }}>
                Cancel Plan
              </Typography.Body>
              <Icon as={NextIcon} ml="auto" />
            </Flex>
          </a>
        </Card>
      ) : (
        <Card m={3} px={4} sx={{ borderRadius: 16 }}>
          <Flex my={4} sx={{ alignItems: "center" }}>
            <Typography.Body
              color="textPrimary"
              sx={{ fontWeight: "bold", lineHeight: 1 }}
            >
              Free Trial
            </Typography.Body>
            <Typography.Body ml="auto">Current Plan</Typography.Body>
          </Flex>
        </Card>
      )}
      <Card m={3} p={4} mt={4} sx={{ borderRadius: 16 }}>
        <Typography.Body
          color="textPrimary"
          sx={{ fontWeight: "bold", lineHeight: 1 }}
          mb={2}
        >
          Standard Plan
        </Typography.Body>

        <Flex sx={{ alignItems: "baseline" }}>
          <Typography.H3 sx={{ fontWeight: "bold", lineHeight: 1 }}>
            $3.99
          </Typography.H3>
          <Typography.Body ml={2} color="textMediumEmphasis">
            User/month
          </Typography.Body>
        </Flex>
        <Typography.Body my={3}>
          Simple pricing for every school.
        </Typography.Body>

        <Box my={3}>
          <Feature text="90-days free trial" />
          <Feature text="Unlimited students" />
          <Feature text="Record observations" />
          <Feature text="Create lesson plans" />
          <Feature text="Track curriculum progress" />
          <Feature text="Parent portal" />
          <Feature text="Image gallery" />
          <Feature text="Reporting" comingSoon />
          <Feature text="And more coming..." />
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
            "Subscribed"
          ) : loading || user.isLoading ? (
            <LoadingIndicator color="onPrimary" />
          ) : (
            "Start Free Trial"
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
      <Icon as={CheckmarkIcon} fill="primary" />
      <Typography.Body ml={2}>{text}</Typography.Body>
      {comingSoon && (
        <Typography.Body ml={2} color="textPrimary">
          Soon
        </Typography.Body>
      )}
    </Flex>
  )
}

export default PageSubscription
