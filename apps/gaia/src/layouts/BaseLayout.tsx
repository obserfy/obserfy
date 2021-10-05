import BottomNavigationBar from "$components/BottomNavigationBar"
import SEO from "$components/Seo"
import SideBar from "$components/SideBar"
import { FC } from "react"

const BaseLayout: FC<{
  title: string
}> = ({ title, children }) => (
  <div className="sm:flex">
    <SEO title={title} />
    <SideBar />

    <div className="w-full">
      <TopBar />
      <main>{children}</main>
    </div>

    <BottomNavigationBar />
  </div>
)

const TopBar = () => (
  <div className="sm:sticky sm:top-0 z-10 h-16 bg-surface border-b" />
)

export default BaseLayout
