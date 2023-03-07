"use client"
import Icon from "$components/Icon/Icon"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FC } from "react"

const SideBarItem: FC<{
  href: string
  text: string
  iconSrc: string
  exact?: boolean
}> = ({ href, text, iconSrc, exact = false }) => {
  const pathName = usePathname()
  const isActive = exact ? pathName === href : pathName?.startsWith(href)

  return (
    <li
      className={clsx(
        "mb-2 flex grow-0 flex-col justify-center",
        isActive && "border-r-2 border-primary-500"
      )}
    >
      <Link
        href={href}
        className={clsx(
          "flex items-center rounded-lg px-3",
          isActive
            ? "font-semibold text-primary-600"
            : "text-gray-800 hover:text-green-800"
        )}
      >
        <div
          className={clsx("mr-3 rounded-lg p-1", isActive && "bg-primary-200")}
        >
          <Icon
            src={iconSrc}
            className="!h-5 !w-5"
            color={isActive ? "bg-black opacity-80" : "bg-gray-800"}
          />
        </div>
        {text}
      </Link>
    </li>
  )
}

export default SideBarItem
