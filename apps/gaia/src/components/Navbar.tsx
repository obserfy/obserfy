import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC } from "react"

interface Props {
  studentId: string
}
const Navbar: FC<Props> = ({ studentId }) => (
  <div className="sticky top-0 z-30 bg-surface border-b">
    <nav className="flex pl-1 mx-auto w-full max-w-3xl">
      <ul className="flex overflow-x-auto">
        <NavbarItem href={`/${studentId}`} text="Timeline" />
        <NavbarItem href={`/${studentId}/assessments`} text="Assessments" />
        <NavbarItem href={`/${studentId}/lesson-plan`} text="Lesson Plan" />
        <NavbarItem href={`/${studentId}/images`} text="Images" />
        <NavbarItem href={`/${studentId}/videos`} text="Videos" />
        <NavbarItem href={`/${studentId}/reports`} text="Reports" />
      </ul>
    </nav>
  </div>
)

const NavbarItem: FC<{ href: string; text: string }> = ({ href, text }) => {
  const router = useRouter()
  const isActive = router.asPath === href

  return (
    <li className="flex-shrink-0 mr-1">
      <Link href={href}>
        <a
          className={clsx(
            "inline-block p-2 text-sm text-gray-700 bg-white",
            isActive && "text-black border-b-2 border-black"
          )}
        >
          {text}
        </a>
      </Link>
    </li>
  )
}

export default Navbar
