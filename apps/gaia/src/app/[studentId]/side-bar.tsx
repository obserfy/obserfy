import { navigationItems } from "$lib/navigation"
import { FC } from "react"
import SideBarItem from "./side-bar-item"

const SideBar: FC<{
  studentId: string
}> = ({ studentId }) => {
  return (
    <nav className="fixed inset-y-0 left-0 hidden h-screen w-sidebar border-r bg-background pt-16 sm:block">
      <ul className="mr-[-1px] py-3">
        {navigationItems(studentId).map((item) => (
          <SideBarItem key={item.href} {...item} />
        ))}
      </ul>
    </nav>
  )
}

export default SideBar
