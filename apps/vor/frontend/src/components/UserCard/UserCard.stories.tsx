import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import UserCard from "./UserCard"

export default {
  title: "Basic|Card/UserCard",
  component: UserCard,
  parameters: {
    componentSubtitle: "Just a simple UserCard",
  },
}

export const Basic: FC = () => (
  <UserCard
    userId="1234"
    email="johnny@gmail.com"
    isCurrentUser
    name="Johnny Obviously"
    onDelete={action("delete user")}
  />
)
