import React, { FC, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

interface Props {
  childId: string
}
const Navbar: FC<Props> = ({ childId }) => {
  const [active, setActive] = useState("lesson-plan")
  const router = useRouter()
  if (router.pathname !== "/") {
    setActive(router.pathname.slice(1, router.pathname.length))
  }
  return (
    <div className="sticky top-0 bg-surface border-b">
      <nav className="w-full flex max-w-3xl mx-auto pt-3">
        <ul className="flex">
          <li className="-mb-px mr-1" onClick={() => setActive("lesson-plan")}>
            <Link href="/">
              <a
                className={`${
                  active === "lesson-plan" ? "border-b border-black" : ""
                } bg-white inline-block py-2 px-4 text-blue-700 font-semibold ${
                  active === "lesson-plan" ? "border-b border-black" : ""
                }`}
              >
                Lesson Plan
              </a>
            </Link>
          </li>
          <li className="mr-1" onClick={() => setActive("gallery")}>
            <Link href={`/gallery?childId=${childId}`}>
              <a
                className={`${
                  active === "gallery" ? "border-b border-black" : ""
                } bg-white inline-block py-2 px-4 text-blue-700 font-semibold`}
              >
                Gallery
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
