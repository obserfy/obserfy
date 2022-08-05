import { Trans } from "@lingui/macro"
import { FC } from "react"
import { Box, Flex, HeadingProps, ThemeUIStyleObject } from "theme-ui"
import { Typography } from "../Typography/Typography"

interface TabProps {
  items: string[]
  selectedItemIdx: number
  onTabClick: (index: number) => void
  small?: boolean
  sx?: ThemeUIStyleObject
}
export const Tab: FC<TabProps> = ({
  items,
  selectedItemIdx,
  onTabClick,
  sx,
  small,
  ...props
}) => (
  <Box sx={{ position: "relative", overflowX: "auto" }} {...props}>
    <Flex
      sx={{
        ...sx,
        minWidth: "100%",
        width: items.length > 3 ? "fit-content" : "100%",
        justifyContent:
          items.length > 3 || items.length === 1 ? "start" : "space-around",
        alignItems: "center",
      }}
      pl={small ? 2 : 0}
    >
      {items.map((item, idx) => (
        <TabItem
          onClick={() => onTabClick(idx)}
          key={item}
          isSelected={selectedItemIdx === idx}
          sx={{
            lineHeight: small ? 2 : undefined,
            fontSize: small ? [0, 0] : [1, 1],
            mx: small ? 2 : 3,
          }}
        >
          <Trans id={item} />
        </TabItem>
      ))}
    </Flex>
    <Border />
  </Box>
)

interface TabItemProps extends HeadingProps {
  isSelected?: boolean
}
const TabItem: FC<TabItemProps> = ({ isSelected, onClick, sx, ...props }) => (
  <Typography.Body
    {...props}
    onClick={onClick}
    px={1}
    mb={0}
    color={isSelected ? "textPrimary" : "textMediumEmphasis"}
    sx={{
      ...sx,
      whiteSpace: "nowrap",
      cursor: "pointer",
      display: "flex",
      flexShrink: 0,
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 12,
      userSelect: "none",
      zIndex: 10,
      "&:after": {
        backgroundColor: "textPrimary",
        borderRadius: "2px 2px 0 0",
        width: isSelected ? "125%" : "0%",
        height: 3,
        content: "''",
        marginTop: 2,
        transition: "width 100ms cubic-bezier(0.0, 0.0, 0.2, 1)",
      },
    }}
  />
)

const Border = () => (
  <Box
    sx={{
      height: "1px",
      width: "100%",
      backgroundColor: "border",
      position: "absolute",
      bottom: 0,
    }}
  />
)

export default Tab
