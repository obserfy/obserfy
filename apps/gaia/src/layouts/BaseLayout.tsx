import { FC } from "react"
import BottomNavigationBar from "$components/BottomNavigationBar"
import SEO from "$components/Seo"
import SideBar from "$components/SideBar"
import TopBar from "$components/TopBar"

const BaseLayout: FC<{
  title: string
}> = ({ title, children }) => (
  <>
    <SEO title={title} />

    <TopBar />
    <div className="sm:flex w-full">
      <SideBar />
      <main className="sm:pl-sidebar w-full">{children}</main>
    </div>
    <BottomNavigationBar />
  </>
)

export default BaseLayout
