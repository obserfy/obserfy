import React, { FC } from "react"
import { Box, SxStyleProp } from "theme-ui"
import { useMemoryStatus } from "react-adaptive-hooks/memory"

export interface TranslucentBarProps {
  as?: React.ElementType
  boxSx?: SxStyleProp
}
export const TranslucentBar: FC<TranslucentBarProps> = ({
  boxSx,
  as,
  children,
}) => {
  const { deviceMemory } = useMemoryStatus({
    deviceMemory: typeof window === "undefined" ? 0 : 4,
  })

  return (
    <Box
      as={as}
      backgroundColor="surfaceBlurNonTransparent"
      sx={{
        ...boxSx,
        "@supports (backdrop-filter: blur(20px))":
          // Only enable on mid to hi end devices, blur is an expensive effect, turned on by default by devices that doesn't
          // support navigator.deviceMemory.
          // 1. On iOS <11 devices, this deviceMemory will always be 4 (the default value for the hooks)
          //    because navigator.deviceMemory is not supported on iOS <11. And the blur effects works
          //    really well on iOS.
          // 2. On all firefox browser as of 11/03/2020, the blur effect will be ignored (not supported).
          // 3. Chrome on android devices, which is where the majority of low end devices lies,
          //    navigator.deviceMemory is supported. This effects will then be disabled on low end devices
          //    with memory up-to 2GB, such as Galaxy S5, which performance got hit really bad with this effect,
          // 4. This will always be turned off before js is loaded, since gatsby's build step will use the default value.
          //    which means the initial html will always include the blur effect. But it doesn't matter, because at load,
          //    the html content is pretty simple.
          deviceMemory > 2
            ? {
                backgroundColor: "surfaceBlurTransparent",
                backdropFilter: "saturate(180%) blur(20px)",
                transform: "translateZ(0)",
                willChange: "backdrop-filter",
              }
            : {},
      }}
    >
      {children}
    </Box>
  )
}

export default TranslucentBar
