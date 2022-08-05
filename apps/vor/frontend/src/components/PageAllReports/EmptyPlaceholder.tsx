import { Trans } from "@lingui/macro"

import { Button, Flex, Text } from "theme-ui"
import { ReactComponent as EmptyIllustration } from "../../images/report-illustration.svg"
import { NEW_REPORT_URL } from "../../routes"
import { Link } from "../Link/Link"

const EmptyPlaceholder = () => (
  <Flex
    sx={{
      flexDirection: ["column-reverse", "column-reverse", "row"],
      justifyContent: ["flex-end", "center"],
      alignItems: "center",
      width: "100%",
      minHeight: "100vh",
    }}
    pt={[4, 0]}
  >
    <Flex
      m={3}
      mr={[3, 3, 5]}
      sx={{
        maxWidth: 400,
        flexDirection: "column",
        alignItems: ["center", "center", "flex-start"],
      }}
    >
      <Text
        mb={3}
        sx={{
          fontSize: [4, 5],
          fontWeight: "bold",
          textAlign: ["center", "center", "inherit"],
        }}
      >
        <Trans>Write progress reports</Trans>
      </Text>
      <Text
        mb={3}
        sx={{
          textAlign: ["center", "center", "inherit"],
          fontSize: 2,
          color: "textMediumEmphasis",
        }}
      >
        <Trans>
          Easily write reports for parents with all the data that you need in
          one place.
        </Trans>
      </Text>

      <Link to={NEW_REPORT_URL}>
        <Button>
          <Trans>Start your first report</Trans>
        </Button>
      </Link>
    </Flex>

    <EmptyIllustration
      sx={{
        pt: [4, 0],
        width: [240, 320],
      }}
    />
  </Flex>
)

export default EmptyPlaceholder
