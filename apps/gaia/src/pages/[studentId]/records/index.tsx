import clsx from "clsx"
import dayjs from "dayjs"
import RecordsHeroImage from "$components/RecordsHeroImage"
import BaseLayout from "$layouts/BaseLayout"
import { withAuthorization } from "$lib/auth"
import { findStudentObservations } from "$lib/db"
import { getStudentId, SSR } from "$lib/next"

const tabs = [
  { name: "Observations", href: "#", current: true },
  { name: "Assessments", href: "#", current: false },
]

const RecordsPage: SSR<typeof getServerSideProps> = ({ observations }) => (
  <BaseLayout title="Records | Observations" className="max-w-7xl">
    <div className="overflow-hidden relative mx-4 mt-2 sm:mt-4 rounded-2xl shadow-md">
      <RecordsHeroImage className="absolute inset-0" />

      <div className="relative p-4 pt-16 lg:pt-32 bg-gradient-to-t from-[rgba(0,0,0,0.4)]">
        <h1 className="mb-4 text-3xl font-bold text-white">Records</h1>
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <a
              key={tab.name}
              href={tab.href}
              className={clsx(
                tab.current
                  ? "text-white bg-black bg-opacity-50"
                  : "text-white bg-black bg-opacity-0 hover:bg-opacity-20 opacity-80",
                "py-2 px-3 text-sm font-medium rounded-md"
              )}
              aria-current={tab.current ? "page" : undefined}
            >
              {tab.name}
            </a>
          ))}
        </nav>
      </div>
    </div>

    <div className="sm:flex items-start m-4">
      <div className="hidden lg:block sticky top-0 flex-shrink-0 w-1/3">
        <h2>Areas</h2>
      </div>

      <ul className="overflow-hidden rounded-xl border divide-y divide-gray-200 shadow-sm">
        {observations.map(
          ({ id, short_desc, long_desc, event_time, areas }) => (
            <li
              key={id}
              className="relative py-5 px-4 bg-white hover:bg-primary-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-600"
            >
              <div className="flex justify-between space-x-3">
                <a href="#" className="block truncate focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="font-semibold text-gray-900 truncate">
                    {short_desc}
                  </p>
                  <p className="font-semibold text-primary-600 truncate">
                    {areas?.name ?? "Others"}
                  </p>
                </a>

                <time
                  dateTime={event_time}
                  className="flex flex-shrink-0 text-gray-500 whitespace-nowrap"
                >
                  {dayjs(event_time).format("DD MMM YYYY")}
                </time>
              </div>
              <div className="mt-1">
                <p className="text-gray-600 line-clamp-2">{long_desc}</p>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  </BaseLayout>
)

export const getServerSideProps = withAuthorization(async (ctx) => {
  const studentId = getStudentId(ctx)
  const observations = await findStudentObservations(studentId)

  return {
    props: {
      observations: observations.map((o) => ({
        ...o,
        created_date: o.created_date?.toISOString(),
        event_time: o.event_time?.toISOString(),
      })),
    },
  }
})

export default RecordsPage
