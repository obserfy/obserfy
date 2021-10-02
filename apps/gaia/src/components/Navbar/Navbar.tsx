import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC } from "react"

interface Props {
  childId: string
}
const Navbar: FC<Props> = ({ childId }) => (
  <div className="sticky top-0 z-30 bg-surface border-b">
    <nav className="flex pl-1 mx-auto w-full max-w-3xl">
      <ul className="flex overflow-x-auto">
        <NavbarItem to="/" text="Timeline" childId={childId} />
        <NavbarItem to="/progress" text="Progress" childId={childId} />
        <NavbarItem to="/lesson-plan" text="Lesson Plan" childId={childId} />
        <NavbarItem to="/images" text="Images" childId={childId} />
        <NavbarItem to="/videos" text="Videos" childId={childId} />
        <NavbarItem2 href={`/${childId}/reports`} text="Reports" />
      </ul>
    </nav>
  </div>
)

const NavbarItem: FC<{ to: string; text: string; childId: string }> = ({
  to,
  childId,
  text,
}) => {
  const router = useRouter()

  return (
    <li className="flex-shrink-0 mr-1">
      <Link href={`${to}?childId=${childId}`}>
        <a
          className={`${
            router.pathname === to ? "border-b-2 border-black" : "text-gray-700"
          } bg-white inline-block p-2 text-sm`}
        >
          {text}
        </a>
      </Link>
    </li>
  )
}

const NavbarItem2: FC<{ href: string; text: string }> = ({ href, text }) => {
  const router = useRouter()
  const isActive = router.pathname === href

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
