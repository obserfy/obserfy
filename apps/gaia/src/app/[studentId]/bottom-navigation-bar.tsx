import { navigationItems } from "$lib/navigation"
import { FC } from "react"
import BottomNavigationBarItem from "./bottom-navigation-bar-item"

const BottomNavigationBar: FC<{
  studentId: string
}> = ({ studentId }) => {
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex h-bottom-navigation flex-col justify-end bg-gradient-to-t from-white via-[rgba(255,255,255,0.95)] sm:hidden">
      <ul className="pointer-events-auto flex h-16 items-center justify-around">
        {navigationItems(studentId).map((item) => (
          <BottomNavigationBarItem key={item.href} {...item} />
        ))}
      </ul>
    </nav>
  )
}

export default BottomNavigationBar
