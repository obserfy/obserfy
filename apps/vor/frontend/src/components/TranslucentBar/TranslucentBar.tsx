import { FC } from "react"
import { Box, ThemeUIStyleObject } from "theme-ui"

export interface TranslucentBarProps {
  as?: React.ElementType
  boxSx?: ThemeUIStyleObject
}

export const TranslucentBar: FC<TranslucentBarProps> = ({
  boxSx = {},
  as,
  children,
}) => {
  // const { deviceMemory } = useMemoryStatus({
  //   deviceMemory: 0, // default always disables blur
  // })
  //
  const sx = { zIndex: 100, ...boxSx }
  // if (deviceMemory > 3) {
  // Only enable blur on mid to hi end devices, cause it is expensive.
  // sx["@supports (backdrop-filter: blur(20px))"] = {
  //   backgroundColor: "surfaceBlurTransparent",
  //   backdropFilter: "saturate(180%) blur(20px)",
  // }
  // }

  return (
    <Box as={as} backgroundColor="surfaceBlurNonTransparent" sx={sx}>
      {children}
    </Box>
  )
}

export default TranslucentBar
