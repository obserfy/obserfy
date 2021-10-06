import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC } from "react"
import { useQueryString } from "$hooks/useQueryString"
import Icon from "$components/Icon/Icon"

const SideBar = () => {
  const studentId = useQueryString("studentId")

  return (
    <nav className="hidden sm:block sticky top-0 left-0 w-80 h-screen bg-background border-r">
      <ul className="p-2 ">
        <Item
          href={`/${studentId}`}
          text="Home"
          iconSrc="/icons/home.svg"
          exact
        />
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
  exact?: boolean
}> = ({ href, text, iconSrc, exact = false }) => {
  const router = useRouter()
  const isActive = exact
    ? router.asPath === href
    : router.asPath.startsWith(href)

  return (
    <li className={clsx("flex flex-col flex-grow-0 justify-center mb-2")}>
      <Link href={href}>
        <a
          className={clsx(
            "flex items-center p-2 font-semibold rounded-lg",
            isActive
              ? "text-green-900 bg-green-100 ring-1 ring-green-300"
              : "hover:bg-green-50 opacity-60"
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
