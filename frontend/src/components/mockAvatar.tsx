import React, { FC } from "react"
import Avatar from "./Avatar/Avatar"
import { BoxProps } from "./Box/Box"

const MockAvatar: FC<BoxProps> = props => (
  <Avatar
    src="https://images.unsplash.com/photo-1571942727532-a67a4bf9845a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80"
    mr={3}
    {...props}
  />
)

export default MockAvatar
