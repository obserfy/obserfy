import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC } from "react"
import { navigationItems } from "$lib/navigation"
import { useQueryString } from "$hooks/useQueryString"
import Icon from "$components/Icon/Icon"

const BottomNavigationBar = () => {
  const studentId = useQueryString("studentId")

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex h-bottom-navigation flex-col justify-end bg-gradient-to-t from-white via-[rgba(255,255,255,0.95)] sm:hidden">
      <ul className="pointer-events-auto flex h-16 items-center justify-around">
        {navigationItems(studentId).map((item) => (
          <Item key={item.href} {...item} />
        ))}
      </ul>
    </nav>
  )
}

const Item: FC<{
  href: string
  text: string
  iconSrc: string
  exact?: boolean
}> = ({ href, text, iconSrc, exact = false }) => {
  const router = useRouter()
  const isActive = exact
    ? router.asPath === href
    : router.asPath.startsWith(href)

  return (
    <li className="flex h-16 w-16 grow-0 flex-col justify-center">
      <Link
        href={href}
        className={clsx(
          "flex flex-col items-center text-[11px] font-semibold",
          isActive ? "text-green-700" : "opacity-50"
        )}
      >
        <Icon
          src={iconSrc}
          className="!h-6 !w-6"
          color={isActive ? "bg-green-600" : "bg-black"}
        />
        {text}
      </Link>
    </li>
  )
}

export default BottomNavigationBar
