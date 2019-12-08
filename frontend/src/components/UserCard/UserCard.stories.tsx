import React, { FC } from "react"
import UserCard from "./UserCard"

export default {
  title: "Core|UserCard",
  component: UserCard,
  parameters: {
    componentSubtitle: "Just a simple UserCard",
  },
}

export const Basic: FC = () => (
  <UserCard email="johnny@gmail.com" isCurrentUser name="Johnny Obviously" />
)
