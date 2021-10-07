import clsx from "clsx"
import { FC } from "react"
import BottomNavigationBar from "$components/BottomNavigationBar"
import SEO from "$components/Seo"
import SideBar from "$components/SideBar"
import TopBar from "$components/TopBar"

const BaseLayout: FC<{
  title: string
  className?: string
}> = ({ title, children, className }) => (
  <>
    <SEO title={title} />

    <TopBar />
    <div className="sm:flex w-full">
      <SideBar />
      <main className={clsx("sm:pl-sidebar mx-auto w-full", className)}>
        {children}
      </main>
    </div>
    <BottomNavigationBar />
  </>
)

export default BaseLayout
