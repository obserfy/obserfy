import clsx from "clsx"
import { useRouter } from "next/router"
import { FC } from "react"
import Link from "next/link"
import Icon from "$components/Icon/Icon"
import { useQueryString } from "$hooks/useQueryString"
import RecordsHeroImage from "$components/RecordsHeroImage"
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

const RecordsLayout: FC<{ title: string }> = ({ title, children }) => {
  const { asPath } = useRouter()
  const studentId = useQueryString("studentId")

  const tabs = getTabs(studentId)

  return (
    <BaseLayout title={`${title} | Records`} className="max-w-7xl">
      <div className="overflow-hidden relative mx-4 mt-2 sm:mt-4 rounded-2xl shadow-md">
        <RecordsHeroImage className="absolute inset-0" />

        <div className="relative p-4 pt-16 lg:pt-32 bg-gradient-to-t from-[rgba(0,0,0,0.6)]">
          <h1 className="mb-4 text-4xl font-bold text-white">Records</h1>
          <nav className="flex space-x-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link key={tab.name} href={tab.href}>
                <a
                  className={clsx(
                    tab.href === asPath
                      ? "text-white bg-black bg-opacity-50"
                      : "text-white bg-black bg-opacity-0 hover:bg-opacity-20 opacity-90",
                    "flex items-center py-2 px-3 text-sm font-medium rounded-md"
                  )}
                  aria-current={tab.name === asPath ? "page" : undefined}
                >
                  <Icon src={tab.iconSrc} color="bg-white" className="mr-1" />
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
