import React, { FC } from "react"
import NavigationItem from "./NavigationItem"
import { ReactComponent as HomeIcon } from "../../icons/home.svg"
import SideBar from "../SideBar/SideBar"

export default {
  title: "Basic|Navigation/NavigationItem",
  component: NavigationItem,
  parameters: {
    componentSubtitle: "Component that acts as a navigation link"
  }
}

export const Basic: FC = () => (
  <SideBar>
    <NavigationItem mt={3} icon={HomeIcon} to="/somewhere" text="home" />
  </SideBar>
)
