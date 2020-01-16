import React, { FC, MouseEventHandler } from "react"
import Icon from "../Icon/Icon"
import { ReactComponent as Menu } from "../../icons/menu-outline.svg"
import { Box } from "../Box/Box"

interface Props {
  onMenuClick?: MouseEventHandler<HTMLImageElement>
}
const MenuIcon: FC<Props> = ({ onMenuClick }) => (
  <Box
    onClick={onMenuClick}
    maxWidth={56}
    sx={{
      cursor: "pointer",
      pointerEvents: ["inherit", "none"],
    }}
  >
    <Icon
      as={Menu}
      data-cy="menu"
      alt="Menu"
      width={["icon", 0]}
      ml={[3, 100]} // 100 is for sliding effect when viewport resize from md to sm
      opacity={[1, 0]}
      size={24}
      // TODO: This animation is everywhere, consider creating animation framework
      sx={{ transition: "margin-left 250ms cubic-bezier(0.0, 0.0, 0.2, 1)" }}
    />
  </Box>
)
export default MenuIcon
