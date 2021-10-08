import RecordsLayout from "$layouts/RecordsLayout"
import { withAuthorization } from "$lib/auth"
import { findStudentObservations } from "$lib/db"
import { getStudentId, SSR } from "$lib/next"
import dayjs from "$lib/dayjs"

const RecordsPage: SSR<typeof getServerSideProps> = ({ observations }) => (
  <RecordsLayout title="Observations">
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
  </RecordsLayout>
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
