import React, { FC, useState } from "react"
import { Box, Button, Card, Flex } from "theme-ui"
import Typography from "../Typography/Typography"
import BackNavigation from "../BackNavigation/BackNavigation"
import Icon from "../Icon/Icon"
import { ReactComponent as CheckmarkIcon } from "../../icons/checkmark-outline.svg"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

export const PageSubscription: FC = () => {
  const [loading, setLoading] = useState(false)

  return (
    <Box mx="auto" sx={{ maxWidth: "maxWidth.xsm" }}>
      <BackNavigation to="../" text="Admin" />
      <Typography.H4 sx={{ fontWeight: "bold", textAlign: "center" }}>
        Subscription Plan
      </Typography.H4>
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
            $11.99
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
          <Feature text="Image gallery" comingSoon />
          <Feature text="Reporting" comingSoon />
          <Feature text="And more coming..." />
        </Box>

        <Button
          mt={4}
          p={3}
          sx={{ width: "100%", fontWeight: "bold", borderRadius: 16 }}
          onClick={() => {
            setLoading(true)
            const script = document.createElement("script")
            script.type = "text/javascript"
            script.onload = () => {
              setLoading(false)
              Paddle.Setup({ vendor: 112134 })
              Paddle.Checkout.open({
                product: 590592,
                email: "chrsep@protonmail.com",
              })
            }
            script.src = "https://cdn.paddle.com/paddle/paddle.js"
            document.getElementsByTagName("head")[0].appendChild(script)
          }}
        >
          {loading && <LoadingIndicator color="onPrimary" />}
          Start Free Trial
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
      <Icon as={CheckmarkIcon} m={0} fill="primary" />
      <Typography.Body ml={2}>{text}</Typography.Body>
      {comingSoon && (
        <Typography.Body ml={2} color="textPrimary">
          Coming Soon
        </Typography.Body>
      )}
    </Flex>
  )
}

export default PageSubscription
