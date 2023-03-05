import { FC, ReactNode } from "react"
import BottomNavigationBar from "./bottom-navigation-bar"
import SideBar from "./side-bar"
import TopBar from "./top-bar"

const BaseLayout: FC<{
  children: ReactNode
  params: { studentId: string }
}> = ({ children, params: { studentId } }) => (
  <>
    {/* @ts-expect-error Server Component */}
    <TopBar studentId={studentId} />
    <div className="w-full sm:flex">
      <SideBar studentId={studentId} />
      <main className={"mx-auto w-full pb-bottom-navigation sm:pl-sidebar"}>
        {children}
      </main>
    </div>
    <BottomNavigationBar studentId={studentId} />
  </>
)

export default BaseLayout
