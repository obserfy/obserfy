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
      <div className="overflow-hidden relative mx-4 mt-2 sm:mt-4 rounded-2xl shadow-md">
        <div className="absolute inset-0">
          <Image
            src={RecordsHeroImage}
            objectFit="cover"
            className="w-full h-full"
            layout="fill"
          />
        </div>

        <div className="relative p-4 pt-16 lg:pt-24 pb-8 lg:pb-12 bg-gradient-to-t from-[rgba(0,0,0,0.6)]">
          <h1 className="mb-4 text-4xl lg:text-5xl font-bold text-center text-white">
            Records
          </h1>

          <nav className="flex justify-center space-x-2" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link key={tab.name} href={tab.href}>
                <a
                  className={clsx(
                    tab.name === currentPage
                      ? "text-white bg-white bg-opacity-20"
                      : "text-white bg-white bg-opacity-0 hover:bg-opacity-10 opacity-90 transition",
                    "flex items-center py-2 px-3 text-sm font-medium rounded-lg border border-white border-opacity-20 backdrop-filter backdrop-blur-sm"
                  )}
                  aria-current={tab.name === currentPage ? "page" : undefined}
                >
                  <Icon
                    src={tab.iconSrc}
                    color="bg-white"
                    className="hidden sm:block mr-2"
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
