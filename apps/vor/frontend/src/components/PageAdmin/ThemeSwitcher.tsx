import { t, Trans } from "@lingui/macro"
import { FC } from "react"
import { Box, Flex, useColorMode } from "theme-ui"
import { ReactComponent as DarkModeIcon } from "../../icons/dark-mode.svg"
import { ReactComponent as LightModeIcon } from "../../icons/light-mode.svg"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import Icon from "../Icon/Icon"
import Typography from "../Typography/Typography"

const ThemeSwitcher: FC = () => {
  const [colorMode, setColorMode] = useColorMode()
  const isDark = colorMode === "dark"

  const handleThemeChange = () => setColorMode(isDark ? "default" : "dark")

  return (
    <Flex
      p={3}
      onClick={handleThemeChange}
      data-cy={isDark ? "light-switch" : "dark-switch"}
      sx={{
        alignItems: "center",
        cursor: "pointer",
        "&:hover": { backgroundColor: "primaryLightest" },
      }}
    >
      <Icon as={isDark ? DarkModeIcon : LightModeIcon} />

      <Box ml={3}>
        <Typography.Body color="textMediumEmphasis" sx={{ fontSize: 0 }}>
          <Trans>Theme</Trans>
        </Typography.Body>
        <Typography.Body>
          <Trans id={isDark ? t`Dark` : t`Light`} />
        </Typography.Body>
      </Box>

      <Icon as={NextIcon} ml="auto" />
    </Flex>
  )
}

export default ThemeSwitcher
