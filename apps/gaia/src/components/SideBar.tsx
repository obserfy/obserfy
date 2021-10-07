import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC } from "react"
import { navigationItems } from "$lib/navigation"
import { useQueryString } from "$hooks/useQueryString"
import Icon from "$components/Icon/Icon"

const SideBar = () => {
  const studentId = useQueryString("studentId")

  return (
    <nav className="hidden sm:block fixed top-0 bottom-0 left-0 pt-16 w-sidebar h-screen bg-background border-r">
      <ul className="py-3">
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
    <li
      className={clsx(
        "flex flex-col flex-grow-0 justify-center mb-2",
        isActive && "border-r-2 border-primary-500"
      )}
    >
      <Link href={href}>
        <a
          className={clsx(
            "flex items-center px-3 rounded-lg",
            isActive
              ? "font-semibold text-primary-600"
              : "text-gray-800 hover:text-green-800"
          )}
        >
          <div
            className={clsx(
              "p-1 mr-3 rounded-lg",
              isActive && "bg-primary-200"
            )}
          >
            <Icon
              src={iconSrc}
              className="!w-5 !h-5"
              color={isActive ? "bg-black opacity-80" : "bg-gray-800"}
            />
          </div>
          {text}
        </a>
      </Link>
    </li>
  )
}

export default SideBar
