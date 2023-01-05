import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { FC } from "react"
import { useQueryString } from "$hooks/useQueryString"
import Icon from "$components/Icon/Icon"
import BaseLayout from "$layouts/BaseLayout"
import MediaHeroImage from "$public/hero/media-hero.svg"

const getTabs = (studentId: string) => [
  {
    name: "Images",
    href: `/${studentId}/media`,
    iconSrc: "/icons/camera.svg",
  },
  {
    name: "Videos",
    href: `/${studentId}/media/videos`,
    iconSrc: "/icons/video.svg",
  },
]

const MediaLayout: FC<{
  title: string
  currentPage: "Images" | "Videos"
  className?: string
}> = ({ title, children, currentPage, className }) => {
  const studentId = useQueryString("studentId")
  const tabs = getTabs(studentId)

  return (
    <BaseLayout
      title={`${title} | Records`}
      className={clsx("max-w-7xl", className)}
    >
      <div className="relative mx-4 mt-2 overflow-hidden rounded-2xl shadow-md sm:mt-4">
        <div className="absolute inset-0">
          <Image
            src={MediaHeroImage}
            objectFit="cover"
            className="h-full w-full"
            layout="fill"
            alt=""
          />
        </div>

        <div className="relative bg-gradient-to-t from-[rgba(0,0,0,0.6)] p-4 py-12 lg:pt-24 lg:pb-12">
          <h1 className="mb-4 text-center text-4xl font-bold text-white lg:text-5xl">
            Media
          </h1>

          <nav className="flex justify-center space-x-2" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={clsx(
                  tab.name === currentPage
                    ? "bg-white bg-opacity-20 text-white"
                    : "bg-white bg-opacity-0 text-white opacity-90 transition hover:bg-opacity-10",
                  "flex items-center rounded-lg border border-white border-opacity-20 py-2 px-3 text-sm font-medium backdrop-blur-sm"
                )}
                aria-current={tab.name === currentPage ? "page" : undefined}
              >
                <Icon src={tab.iconSrc} color="bg-white" className="mr-2" />
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {children}
    </BaseLayout>
  )
}

export default MediaLayout
