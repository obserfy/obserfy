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
    <nav className="z-20 flex sm:hidden fixed right-0 bottom-0 left-0 flex-col justify-end h-bottom-navigation bg-gradient-to-t from-white pointer-events-none via-[rgba(255,255,255,1)]">
      <ul className="flex justify-around items-center h-16 pointer-events-auto">
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
    <li className="flex flex-col flex-grow-0 justify-center w-16 h-16">
      <Link href={href}>
        <a
          className={clsx(
            "flex flex-col items-center font-semibold text-[11px]",
            isActive ? "text-green-700" : "opacity-50"
          )}
        >
          <Icon
            src={iconSrc}
            className="!w-6 !h-6"
            color={isActive ? "bg-green-600" : "bg-black"}
          />
          {text}
        </a>
      </Link>
    </li>
  )
}

export default BottomNavigationBar
