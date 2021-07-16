import { Trans } from "@lingui/macro"
import { useLocalization } from "gatsby-theme-i18n"

import { Box, Flex } from "theme-ui"
import { ReactComponent as GlobeIcon } from "../../icons/globe.svg"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import Icon from "../Icon/Icon"
import Typography from "../Typography/Typography"

const LanguageSwitcher = () => {
  const { locale } = useLocalization()

  const switchLanguage = () => {
    window.localStorage.setItem("preferred-lang", locale === "id" ? "en" : "id")
    window.location.replace(`${locale === "id" ? "" : "/id"}/dashboard/admin`)
  }

  return (
    <Flex
      sx={{
        alignItems: "center",
        cursor: "pointer",
        "&:hover": { backgroundColor: "primaryLightest" },
      }}
      p={3}
      onClick={switchLanguage}
      data-cy={locale === "en" ? "switch-indonesian" : "switch-english"}
    >
      <Icon as={GlobeIcon} fill="background" />
      <Box ml={3}>
        <Typography.Body color="textMediumEmphasis" sx={{ fontSize: 0 }}>
          <Trans>Language</Trans>
        </Typography.Body>
        <Typography.Body>
          {locale === "en" ? "English" : "Indonesian"}
        </Typography.Body>
      </Box>
      <Icon as={NextIcon} ml="auto" />
    </Flex>
  )
}

export default LanguageSwitcher
