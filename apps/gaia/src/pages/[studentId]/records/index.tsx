import RecordsLayout from "$layouts/RecordsLayout"
import { withAuthorization } from "$lib/auth"
import {
  findCurriculumAreasByStudentId,
  findStudentObservations,
} from "$lib/db"
import { getStudentId, SSR } from "$lib/next"
import dayjs from "$lib/dayjs"

const RecordsPage: SSR<typeof getServerSideProps> = ({
  observations,
  areas,
}) => (
  <RecordsLayout title="Observations">
    <div className="sm:flex items-start m-4">
      <div className="hidden lg:block sticky top-20 flex-shrink-0 mr-4 w-1/3 rounded-xl">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Area
          </label>
          <select
            id="location"
            name="location"
            className="block py-2 pr-10 pl-3 mt-1 w-full text-base sm:text-sm rounded-md border-gray-200 focus:border-primary-500 focus:ring-primary-500 shadow-sm focus:outline-none"
            defaultValue="Canada"
          >
            {areas.map(({ id, name }) => (
              <option key={id}>{name}</option>
            ))}
          </select>
        </div>

        <div className="isolate mt-4 -space-y-px bg-white rounded-md shadow-sm">
          <div className="relative focus-within:z-10 py-2 px-3 rounded-md rounded-b-none border focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              From
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="block p-0 placeholder-gray-500 text-gray-900 border-0 focus:ring-0"
              placeholder="26 Jan 2016"
            />
          </div>
          <div className="relative focus-within:z-10 py-2 px-3 rounded-md rounded-t-none border focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600">
            <label
              htmlFor="job-title"
              className="block w-full text-sm font-medium text-gray-700"
            >
              To
            </label>
            <input
              type="text"
              name="job-title"
              id="job-title"
              className="block p-0 w-full placeholder-gray-500 text-gray-900 border-0 focus:ring-0"
              placeholder="21 Sep 2021"
            />
          </div>
        </div>
      </div>

      <ul className="overflow-hidden rounded-xl border divide-y divide-gray-200 shadow-sm">
        {observations.map(
          ({ id, short_desc, long_desc, event_time, areas: a }) => (
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
                    {a?.name ?? "Others"}
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
  const areas = await findCurriculumAreasByStudentId(studentId)

  return {
    props: {
      areas: areas ?? [],
      observations: observations.map((o) => ({
        ...o,
        created_date: o.created_date?.toISOString(),
        event_time: o.event_time?.toISOString(),
      })),
    },
  }
})

export default RecordsPage
