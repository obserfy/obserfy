import Link from "next/link"
import { useRouter } from "next/router"
import { FC } from "react"

interface Props {
  childId: string
}
const Navbar: FC<Props> = ({ childId }) => (
  <div className="sticky top-0 bg-surface border-b z-30">
    <nav className="w-full flex max-w-3xl mx-auto pl-1">
      <ul className="flex overflow-x-auto">
        <NavbarItem to="/" text="Timeline" childId={childId} />
        <NavbarItem to="/progress" text="Progress" childId={childId} />
        <NavbarItem to="/lesson-plan" text="Lesson Plan" childId={childId} />
        <NavbarItem to="/images" text="Images" childId={childId} />
        <NavbarItem to="/videos" text="Videos" childId={childId} />
        <NavbarItem to="/support" text="Support" childId={childId} />
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
    <li className="mr-1 flex-shrink-0">
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

export default Navbar
