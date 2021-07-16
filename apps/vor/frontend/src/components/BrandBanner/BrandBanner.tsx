import { StaticImage } from "gatsby-plugin-image"
import { FC } from "react"
import { Flex, Box } from "theme-ui"
import { Trans } from "@lingui/macro"
import { Typography } from "../Typography/Typography"

export const BrandBanner: FC = () => (
  <Box mx="auto" p={3} sx={{ width: "100%", maxWidth: "maxWidth.xsm" }}>
    <a href="https://obserfy.com" sx={{ display: "inline-block" }}>
      <Flex sx={{ alignItems: "center" }}>
        <StaticImage
          src="../../images/logo-standalone.png"
          width={32}
          alt="obserfy logo"
          sx={{ flexShrink: 0 }}
          placeholder="blurred"
        />
        <Typography.Body
          ml={2}
          sx={{ fontSize: 3, fontWeight: "bold", lineHeight: 1.2 }}
        >
          Obserfy{" "}
          <span sx={{ fontWeight: "normal", whiteSpace: "nowrap" }}>
            <Trans>for Teachers</Trans>
          </span>
        </Typography.Body>
      </Flex>
    </a>
  </Box>
)

export default BrandBanner
