import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC } from "react"
import { useQueryString } from "$hooks/useQueryString"
import Icon from "$components/Icon/Icon"

const SideBar = () => {
  const studentId = useQueryString("studentId")

  return (
    <nav className="hidden sm:block fixed top-0 bottom-0 left-0 pt-16 w-sidebar h-screen bg-background border-r">
      <ul className="py-3">
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
    <li
      className={clsx(
        "flex flex-col flex-grow-0 justify-center mb-2",
        isActive && "border-r-2 border-emerald-500"
      )}
    >
      <Link href={href}>
        <a
          className={clsx(
            "flex items-center px-3 rounded-lg",
            isActive
              ? "font-semibold text-emerald-600"
              : "text-gray-800 hover:text-green-800"
          )}
        >
          <div
            className={clsx(
              "p-1 mr-3 rounded-lg",
              isActive && "bg-emerald-200"
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
