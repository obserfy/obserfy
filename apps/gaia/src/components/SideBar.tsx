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
    <nav className="fixed inset-y-0 left-0 hidden h-screen w-sidebar border-r bg-background pt-16 sm:block">
      <ul className="mr-[-1px] py-3">
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
        "mb-2 flex grow-0 flex-col justify-center",
        isActive && "border-r-2 border-primary-500"
      )}
    >
      <Link href={href}>
        <a
          className={clsx(
            "flex items-center rounded-lg px-3",
            isActive
              ? "font-semibold text-primary-600"
              : "text-gray-800 hover:text-green-800"
          )}
        >
          <div
            className={clsx(
              "mr-3 rounded-lg p-1",
              isActive && "bg-primary-200"
            )}
          >
            <Icon
              src={iconSrc}
              className="!h-5 !w-5"
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
