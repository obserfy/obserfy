import React, { FC } from "react"
import { Box, FlexProps, Flex, HeadingProps } from "theme-ui"
import { Typography } from "../Typography/Typography"

interface TabProps extends FlexProps {
  items: string[]
  selectedItemIdx: number
  onTabClick: (index: number) => void
  small?: boolean
}
export const Tab: FC<TabProps> = ({
  items,
  selectedItemIdx,
  onTabClick,
  sx,
  small,
  ...props
}) => (
  <Box sx={{ overflowX: "auto" }} {...props}>
    <Flex
      sx={{
        ...sx,
        borderBottomColor: "border",
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        minWidth: "100%",
        width: items.length > 3 ? "fit-content" : "100%",
        justifyContent:
          items.length > 3 || items.length === 1 ? "start" : "space-around",
        alignItems: "center",
      }}
    >
      {items.map((item, idx) => (
        <TabItem
          onClick={() => onTabClick(idx)}
          key={item}
          isSelected={selectedItemIdx === idx}
          sx={{
            fontWeight: small ? "normal" : "lighter",
            lineHeight: small ? 2 : undefined,
            fontSize: small ? 0 : undefined,
          }}
        >
          {item}
        </TabItem>
      ))}
    </Flex>
  </Box>
)

interface TabItemProps extends HeadingProps {
  isSelected?: boolean
}
const TabItem: FC<TabItemProps> = ({ isSelected, onClick, sx, ...props }) => (
  <Typography.H6
    {...props}
    onClick={onClick}
    mx={3}
    mb={0}
    color={isSelected ? "textPrimary" : "text"}
    sx={{
      ...sx,
      whiteSpace: "nowrap",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 12,
      userSelect: "none",
      "&:after": {
        backgroundColor: "primary",
        borderRadius: "2px 2px 0 0",
        width: isSelected ? "125%" : "0%",
        height: 3,
        content: "''",
        marginTop: 12,
        transition: "width 100ms cubic-bezier(0.0, 0.0, 0.2, 1)",
      },
    }}
  />
)

export default Tab
