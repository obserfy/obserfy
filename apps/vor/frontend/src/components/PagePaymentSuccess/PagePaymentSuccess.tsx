import { t, Trans } from "@lingui/macro"
import { FC } from "react"
import { Box, Button, Card, Flex, Image } from "theme-ui"
import { useGetSchool } from "../../hooks/api/schools/useGetSchool"
import { ReactComponent as SuccessIllustration } from "../../images/success.svg"
import { ADMIN_SUBSCRIPTION_URL, ADMIN_URL } from "../../routes"
import { Link } from "../Link/Link"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import Typography from "../Typography/Typography"

export interface PagePaymentSuccessProps {}

const PagePaymentSuccess: FC<PagePaymentSuccessProps> = () => {
  useGetSchool()

  return (
    <Box mx="auto" sx={{ maxWidth: "maxWidth.xsm" }}>
      <TopBar
        breadcrumbs={[
          breadCrumb(t`Admin`, ADMIN_URL),
          breadCrumb(t`Plans & Billing`, ADMIN_SUBSCRIPTION_URL),
          breadCrumb(t`Payment Success `),
        ]}
      />

      <Card sx={{ borderRadius: [0, 32] }} py={5} mt={[0, 4]}>
        <Image as={SuccessIllustration} width="100%" px={[5, 6]} pb={4} />

        <Typography.H4 sx={{ textAlign: "center" }} mb={3}>
          <Trans>Thanks for Subscribing!</Trans>
        </Typography.H4>
        <Typography.Body
          sx={{ textAlign: "center", fontSize: 2 }}
          mb={4}
          px={4}
        >
          <Trans>
            Your purchase is complete. A receipt of your order will be sent to
            you by email. Thanks for supporting us!
          </Trans>
        </Typography.Body>

        <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
          <Link to={ADMIN_SUBSCRIPTION_URL}>
            <Button
              p={3}
              sx={{ width: "100%", fontWeight: "bold", borderRadius: 16 }}
            >
              <Trans>Back to Billing</Trans>
            </Button>
          </Link>
        </Flex>
      </Card>
    </Box>
  )
}

export default PagePaymentSuccess
