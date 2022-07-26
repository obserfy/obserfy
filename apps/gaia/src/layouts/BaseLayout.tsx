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

    <div className="w-full sm:flex">
      <SideBar />
      <main
        className={clsx(
          className,
          "mx-auto w-full pb-bottom-navigation sm:pl-sidebar"
        )}
      >
        {children}
      </main>
    </div>
    <BottomNavigationBar />
  </>
)

export default BaseLayout
