import React, { FC } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

interface Props {
  childId: string
}
const Navbar: FC<Props> = ({ childId }) => {
  const router = useRouter()

  return (
    <div className="sticky top-0 bg-surface border-b z-30">
      <nav className="w-full flex max-w-3xl mx-auto pl-1">
        <ul className="flex overflow-x-auto">
          <li className="mr-1 flex-shrink-0">
            <Link href={`/?childId=${childId}`}>
              <a
                className={`${
                  router.pathname === "/"
                    ? "border-b-2 border-black"
                    : "text-gray-700"
                } bg-white inline-block p-2 text-sm`}
              >
                Timeline
              </a>
            </Link>
          </li>
          <li className="mr-1 flex-shrink-0">
            <Link href={`/curriculum?childId=${childId}`}>
              <a
                className={`${
                  router.pathname === "/curriculum"
                    ? "border-b-2 border-black"
                    : "text-gray-700"
                } bg-white inline-block p-2 text-sm`}
              >
                Curriculum
              </a>
            </Link>
          </li>
          <li className="mr-1 flex-shrink-0">
            <Link href={`/lesson-plan?childId=${childId}`}>
              <a
                className={`${
                  router.pathname === "/lesson-plan"
                    ? "border-b-2 border-black"
                    : "text-gray-700"
                } bg-white inline-block p-2 text-sm`}
              >
                Lesson Plan
              </a>
            </Link>
          </li>
          <li className="mr-1 flex-shrink-0">
            <Link href={`/gallery?childId=${childId}`}>
              <a
                className={`${
                  router.pathname === "/gallery"
                    ? "border-b-2 border-black"
                    : "text-gray-700"
                } bg-white inline-block p-2 text-sm`}
              >
                Gallery
              </a>
            </Link>
          </li>
          <li className="mr-1 flex-shrink-0">
            <Link href={`/support?childId=${childId}`}>
              <a
                className={`${
                  router.pathname === "/support"
                    ? "border-b-2 border-black"
                    : "text-gray-700"
                } bg-white inline-block p-2 text-sm`}
              >
                Support
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
