"use client"
import Icon from "$components/Icon/Icon"
import clsx from "clsx"
import Link from "next/link"
import { FC } from "react"
import { usePathname } from "next/navigation"

const BottomNavigationBarItem: FC<{
  href: string
  text: string
  iconSrc: string
  exact?: boolean
}> = ({ href, text, iconSrc, exact = false }) => {
  const pathName = usePathname()
  const isActive = exact ? pathName === href : pathName?.startsWith(href)

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

export default BottomNavigationBarItem
