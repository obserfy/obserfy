import React, { FC } from "react"
import { Typography, TextProps } from "../Typography/Typography"
import Flex, { FlexProps } from "../Flex/Flex"
import Box from "../Box/Box"

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
  <Box overflowX="auto" {...props}>
    <Flex
      sx={Object.assign(sx != null ? sx : {}, {
        borderBottomColor: "border",
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
      })}
      minWidth="100%"
      width={items.length > 3 ? "fit-content" : "100%"}
      justifyContent={
        items.length > 3 || items.length === 1 ? "start" : "space-around"
      }
      alignItems="center"
    >
      {items.map((item, idx) => (
        <TabItem
          onClick={() => onTabClick(idx)}
          key={item}
          isSelected={selectedItemIdx === idx}
          fontSize={small ? 0 : undefined}
          lineHeight={small ? 2 : undefined}
          fontWeight={small ? "normal" : "lighter"}
        >
          {item}
        </TabItem>
      ))}
    </Flex>
  </Box>
)

interface TabItemProps extends TextProps {
  isSelected?: boolean
  onClick?: () => void
}
const TabItem: FC<TabItemProps> = ({ isSelected, onClick, ...props }) => (
  <Typography.H6
    {...props}
    onClick={onClick}
    mx={3}
    mb={0}
    color={isSelected ? "primaryDark" : "text"}
    sx={{
      whiteSpace: "nowrap",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 12,
      userSelect: "none",
      "&:after": {
        backgroundColor: "primary",
        borderRadius: "10px 10px 0 0",
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
