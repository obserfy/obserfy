import React, { FC } from "react"
import Button, { ButtonProps } from "../Button/Button"

export const FloatingActionButton: FC<ButtonProps> = props => (
  <Button
    display="flex"
    minWidth={60}
    minHeight={60}
    sx={{
      boxShadow:
        "rgba(0, 0, 0, 0.1) 0px 0px 1px, rgba(0, 0, 0, 0.27) 0px 2px 4px -2px",
      justifyContent: "center",
      borderRadius: "circle",
      position: "fixed",
      bottom: 0,
      right: 0,
      alignItems: "center",
    }}
    m={3}
    {...props}
  />
)

export default FloatingActionButton
