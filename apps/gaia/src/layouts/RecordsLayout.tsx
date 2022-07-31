import clsx from "clsx"
import Link from "next/link"
import { FC } from "react"
import Image from "next/image"
import Icon from "$components/Icon/Icon"
import RecordsHeroImage from "$public/hero/records-hero.svg"
import { useQueryString } from "$hooks/useQueryString"
import BaseLayout from "$layouts/BaseLayout"

const getTabs = (studentId: string) => [
  {
    name: "Observations",
    href: `/${studentId}/records`,
    iconSrc: "/icons/edit.svg",
  },
  {
    name: "Assessments",
    href: `/${studentId}/records/assessments`,
    iconSrc: "/icons/chart.svg",
  },
]

const RecordsLayout: FC<{
  title: string
  currentPage: "Assessments" | "Observations"
}> = ({ title, children, currentPage }) => {
  const studentId = useQueryString("studentId")
  const tabs = getTabs(studentId)

  return (
    <BaseLayout title={`${title} | Records`} className="max-w-7xl">
      <div className="relative mx-4 mt-2 overflow-hidden rounded-2xl shadow-md sm:mt-4">
        <div className="absolute inset-0">
          <Image
            src={RecordsHeroImage}
            objectFit="cover"
            className="h-full w-full"
            layout="fill"
          />
        </div>

        <div className="relative bg-gradient-to-t from-[rgba(0,0,0,0.6)] p-4 pt-16 pb-8 lg:pt-24 lg:pb-12">
          <h1 className="mb-4 text-center text-4xl font-bold text-white lg:text-5xl">
            Records
          </h1>

          <nav className="flex justify-center space-x-2" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link key={tab.name} href={tab.href}>
                <a
                  className={clsx(
                    tab.name === currentPage
                      ? "bg-white bg-opacity-20 text-white"
                      : "bg-white bg-opacity-0 text-white opacity-90 transition hover:bg-opacity-10",
                    "flex items-center rounded-lg border border-white border-opacity-20 py-2 px-3 text-sm font-medium backdrop-blur-sm"
                  )}
                  aria-current={tab.name === currentPage ? "page" : undefined}
                >
                  <Icon
                    src={tab.iconSrc}
                    color="bg-white"
                    className="mr-2 hidden sm:block"
                  />
                  {tab.name}
                </a>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {children}
    </BaseLayout>
  )
}

export default RecordsLayout
