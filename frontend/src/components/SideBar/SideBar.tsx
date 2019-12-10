import React, { FC, MouseEventHandler } from "react"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import Image from "../Image/Image"

interface Props {
  isShown?: boolean
  onOutsideClick?: MouseEventHandler<HTMLDivElement>
}
export const SideBar: FC<Props> = ({
  isShown = true,
  onOutsideClick,
  children,
}) => (
  <>
    <Flex
      data-cy="sidebar"
      as="nav"
      flexDirection="column"
      backgroundColor="background"
      width={["82%", "sidebar.desktop"]}
      height="calc(100% + 57px)"
      pb="65px"
      overflowY="auto"
      sx={{
        maxWidth: "sidebar.mobile",
        minWidth: "sidebar.desktop",
        position: "fixed",
        transform: [`translateX(${isShown ? 0 : -100}%)`, "none"],
        boxShadow: [isShown ? "low" : "none", "none"],
        // Todo: Maybe migrate this to theme.ts to make it portable
        transition: "transform 250ms cubic-bezier(0.0, 0.0, 0.2, 1)",
        top: 0,
        left: 0,
        zIndex: [1250000, 0],
        borderRightStyle: "solid",
        borderRightColor: "border",
        borderRightWidth: 1,
      }}
    >
      {children}
    </Flex>
    <Box
      data-cy="outsideSidebar"
      backgroundColor={isShown ? "overlay" : "#00000000"}
      onClick={onOutsideClick}
      width="100%"
      height="100%"
      sx={{
        cursor: "pointer",
        display: ["inherit", "none"],
        pointerEvents: isShown ? "inherit" : "none",
        position: "fixed",
        top: 0,
        left: 0,
        minHeight: "100vh",
        zIndex: 1000001,
        // Todo: Maybe migrate this to theme.ts to make it portable
        transition: "background 250ms cubic-bezier(0.0, 0.0, 0.2, 1)",
      }}
    />
    <Box
      height="appbar"
      width="18vw"
      display={[isShown ? "flex" : "none", "none"]}
      sx={{
        cursor: "pointer",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 1500000,
      }}
      onClick={onOutsideClick}
    >
      <Image as={CloseIcon} size={36} sx={{ fill: "onOverlay" }} />
    </Box>
  </>
)

export default SideBar
