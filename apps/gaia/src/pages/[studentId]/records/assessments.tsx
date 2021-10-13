import Image from "next/image"
import { useRouter } from "next/router"
import { ChangeEvent, FC, useEffect, useState } from "react"
import Button from "$components/Button/Button"
import Icon from "$components/Icon/Icon"
import Select from "$components/Select"
import TextFieldWithIcon from "$components/TextFieldWithIcon"
import useDebounce from "$hooks/useDebounce"
import { useQueryString } from "$hooks/useQueryString"
import RecordsLayout from "$layouts/RecordsLayout"
import { withAuthorization } from "$lib/auth"
import dayjs from "$lib/dayjs"
import {
  findCurriculumAreasByStudentId,
  findMaterialAssessmentByStudentIdAndAreaId,
} from "$lib/db"
import { getQueryString, getStudentId, SSR } from "$lib/next"

const RecordsPage: SSR<typeof getServerSideProps> = ({
  observations,
  areas,
  defaultArea,
}) => {
  const query = useFilterQueries()
  const setQueries = useSetQueries()

  const [area, setArea] = useState(query.area || defaultArea)
  const [search, setSearch] = useState(query.search || "")

  const debouncedSearch = useDebounce(search, 250)
  useEffect(() => {
    if (query.search !== debouncedSearch) {
      setQueries({ search: debouncedSearch })
    }
  }, [debouncedSearch, query.search, setQueries])

  const handleAreaChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    await setQueries({ area: e.target.value })
    setArea(e.target.value)
  }

  const handleBulkChange = async (val: { search: string; area: string }) => {
    if (val.area !== area) {
      await setQueries({ area: val.area })
      setArea(val.area)
    }
    if (val.search !== search) {
      await setQueries({ search: val.search })
      setSearch(val.search)
    }
  }

  const handleReset = async () =>
    handleBulkChange({ search: "", area: defaultArea })

  const isFiltered = search !== "" || area !== defaultArea

  return (
    <RecordsLayout title="Assessments" currentPage="Assessments">
      <div className="lg:flex items-start mx-4 lg:mt-4">
        <Select
          defaultValue={area}
          value={area}
          onChange={handleAreaChange}
          label="Area"
          name="area"
          containerClassName="lg:hidden mt-4 z-2"
          selectClassName="rounded-xl"
          hideLabel
        >
          {areas.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Select>

        <div className="lg:hidden sticky top-0 z-10 py-4 bg-gradient-to-b from-white via-white">
          <TextFieldWithIcon
            label="Search"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`"Reading ..."`}
            containerClassName="rounded-lg w-full"
            inputClassName="!rounded-xl"
            hideLabel
          />
        </div>

        <div className="hidden lg:block sticky top-20 flex-shrink-0 p-4 mr-4 mb-6 w-full lg:w-1/3 bg-gray-100 rounded-xl">
          <h2 className="flex justify-center items-center mb-3 font-semibold leading-none opacity-50">
            <Icon
              src="/icons/filter.svg"
              className="mr-1"
              color="bg-gray-800"
            />
            Filters
          </h2>

          <TextFieldWithIcon
            label="Search"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`"Reading ..."`}
            containerClassName="mb-2"
          />

          <Select
            defaultValue={area}
            value={area}
            onChange={handleAreaChange}
            label="Area"
            name="area"
          >
            {areas.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </Select>

          {isFiltered && (
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={handleReset}
            >
              Reset
            </Button>
          )}
        </div>

        <ul className="overflow-hidden w-full rounded-xl border divide-y divide-gray-200 shadow-sm">
          {observations.map(
            ({
              id,
              short_desc,
              long_desc,
              event_time,
              areas: a,
              observation_to_images: img,
            }) => (
              <Observation
                key={id}
                areas={a}
                short_desc={short_desc}
                long_desc={long_desc}
                event_time={event_time}
                images={img}
              />
            )
          )}
        </ul>
      </div>
    </RecordsLayout>
  )
}

const Observation: FC<{
  event_time: string
  short_desc: string | null
  long_desc: string | null
  areas: { name: string | null } | null
  images: Array<{ src: string | null }>
}> = ({ short_desc, areas, event_time, long_desc, images }) => (
  <li className="relative py-5 px-4 bg-white hover:bg-primary-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-600">
    <div className="flex justify-between space-x-3">
      <button className="block text-left truncate focus:outline-none">
        <span className="absolute inset-0" aria-hidden="true" />
        <p className="font-semibold text-gray-900 truncate">{short_desc}</p>
        <p className="font-semibold text-primary-600 truncate">
          {areas?.name ?? "Others"}
        </p>
      </button>

      <time
        dateTime={event_time}
        className="flex flex-shrink-0 text-gray-500 whitespace-nowrap"
      >
        {dayjs(event_time).format("DD MMM YYYY")}
      </time>
    </div>
    <div className="mt-1">
      {long_desc && (
        <div
          className="max-w-none text-gray-700 prose"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: long_desc }}
        />
      )}
    </div>

    {images.length > 0 && (
      <h3 className="mt-2 mb-2 font-semibold text-gray-500">Images</h3>
    )}
    <div className="flex space-x-2">
      {images.map(({ src }) => {
        if (src) {
          return (
            <div className="flex w-12 h-12">
              <Image
                src={src}
                width={100}
                height={100}
                objectFit="cover"
                className="block rounded-lg"
              />
            </div>
          )
        }

        return <div />
      })}
    </div>
  </li>
)

export const getServerSideProps = withAuthorization(async (ctx) => {
  const studentId = getStudentId(ctx)
  const search = getQueryString(ctx, "search")

  const areas = await findCurriculumAreasByStudentId(studentId)
  const defaultArea = areas?.[0].id
  const area = getQueryString(ctx, "area") || defaultArea

  const assessments = await findMaterialAssessmentByStudentIdAndAreaId(
    studentId,
    area,
    { search }
  )

  return {
    props: {
      defaultArea,
      areas: areas ?? [],
      observations: [],
      assessments,
    },
  }
})

const useSetQueries = () => {
  const router = useRouter()
  return async (query: any) => {
    await router.push({
      pathname: router.pathname,
      query: { ...router.query, ...query },
    })
  }
}

const useFilterQueries = () => {
  return {
    area: useQueryString("area"),
    search: useQueryString("search"),
  }
}

export default RecordsPage
