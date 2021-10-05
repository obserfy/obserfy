import Icon from "$components/Icon/Icon"
import { useQueryString } from "$hooks/useQueryString"
import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC } from "react"

const SideBar = () => {
  const studentId = useQueryString("studentId")

  return (
    <nav className="hidden sm:block sticky top-0 left-0 w-80 h-screen bg-background border-r">
      <div className="h-16 border-b" />

      <ul className="p-2 ">
        <Item href={`/${studentId}`} text="Home" iconSrc="/icons/home.svg" />
        <Item
          href={`/${studentId}/lesson-plan`}
          text="Lessons"
          iconSrc="/icons/book.svg"
        />
        <Item
          href={`/${studentId}/reports`}
          text="Reports"
          iconSrc="/icons/folder.svg"
        />
        <Item
          href={`/${studentId}/assessments`}
          text="Records"
          iconSrc="/icons/archive.svg"
        />
        <Item
          href={`/${studentId}/images`}
          text="Media"
          iconSrc="/icons/camera.svg"
        />
      </ul>
    </nav>
  )
}

const Item: FC<{
  href: string
  text: string
  iconSrc: string
}> = ({ href, text, iconSrc }) => {
  const router = useRouter()
  const isActive = router.asPath === href

  return (
    <li
      className={clsx(
        "flex flex-col flex-grow-0 justify-center p-2 mb-2 rounded-lg",
        isActive ? "bg-green-100 ring-1 ring-green-300" : "hover:bg-green-50 "
      )}
    >
      <Link href={href}>
        <a
          className={clsx(
            "flex items-center font-medium",
            isActive ? "text-green-900" : "opacity-50"
          )}
        >
          <Icon
            src={iconSrc}
            className="mr-3 !w-5 !h-5"
            color={isActive ? "bg-green-900" : "bg-black"}
          />
          {text}
        </a>
      </Link>
    </li>
  )
}

export default SideBar
