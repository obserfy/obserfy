import Image from "next/image"
import { useRouter } from "next/router"
import { ChangeEvent, FC, useEffect, useState } from "react"
import Button from "$components/Button/Button"
import Icon from "$components/Icon/Icon"
import Select from "$components/Select"
import SlideOver from "$components/SlideOver"
import TextFieldWithIcon from "$components/TextFieldWithIcon"
import useDebounce from "$hooks/useDebounce"
import { useQueryString } from "$hooks/useQueryString"
import useToggle from "$hooks/useToggle"
import RecordsLayout from "$layouts/RecordsLayout"
import { withAuthorization } from "$lib/auth"
import dayjs, { Dayjs } from "$lib/dayjs"
import {
  findCurriculumAreasByStudentId,
  findOldestObservationDate,
  findStudentObservations,
} from "$lib/db"
import { getQueryString, getStudentId, SSR } from "$lib/next"
import { generateOriginalUrl } from "../../../utils/imgproxy"
import { markdownToHtml } from "../../../utils/markdown"

const today = dayjs()

const RecordsPage: SSR<typeof getServerSideProps> = ({
  observations,
  areas,
  oldestDate,
}) => {
  const filterSlideOver = useToggle()

  const query = useFilterQueries()
  const setQueries = useSetQueries()

  const [area, setArea] = useState(query.area || "all")
  const [from, setFrom] = useState(dayjs(query.from || oldestDate))
  const [to, setTo] = useState(query.to ? dayjs(query.to) : today)
  const [search, setSearch] = useState(query.search || "")

  const handleAreaChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    await setQueries({ area: e.target.value })
    setArea(e.target.value)
  }

  const handleFromChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = dayjs(e.target.value || oldestDate)
    await setQueries({ from: value.format("YYYY-MM-DD") })
    setFrom(value)
  }

  const handleToChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = dayjs(e.target.value || today)
    await setQueries({ to: value.format("YYYY-MM-DD") })
    setTo(value)
  }

  const handleSearchChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const debouncedSearch = useDebounce(search, 250)
  useEffect(() => {
    if (query.search !== debouncedSearch) {
      // noinspection JSIgnoredPromiseFromCall
      setQueries({ search: debouncedSearch })
    }
  }, [debouncedSearch, query.search, setQueries])

  const handleBulkChange = async (val: {
    search: string
    area: string
    from: Dayjs
    to: Dayjs
  }) => {
    if (!val.to.isSame(to)) {
      await setQueries({ to: val.to.format("YYYY-MM-DD") })
      setTo(val.to)
    }
    if (!val.from.isSame(from)) {
      await setQueries({ from: val.from.format("YYYY-MM-DD") })
      setTo(val.from)
    }
    if (val.area !== area) {
      await setQueries({ area: val.area })
      setArea(val.area)
    }
    if (val.search !== search) {
      setSearch(val.search)
    }
  }

  const handleReset = async () => {
    await handleBulkChange({
      to: today,
      from: dayjs(oldestDate),
      search: "",
      area: "all",
    })
  }

  const isFiltered =
    !to.isSame(today) ||
    !from.isSame(dayjs(oldestDate)) ||
    search !== "" ||
    area !== "all"

  return (
    <RecordsLayout title="Observations" currentPage="Observations">
      <div className="lg:flex items-start mx-4 lg:mt-4">
        <div className="lg:hidden sticky top-0 z-10 py-4 bg-gradient-to-b from-white via-white">
          <div className="flex">
            <TextFieldWithIcon
              label="Search"
              name="search"
              value={search}
              onChange={handleSearchChange}
              placeholder={`"Reading ..."`}
              containerClassName="rounded-lg w-full"
              inputClassName="!rounded-xl"
              hideLabel
            />

            <Button
              variant="outline"
              className="ml-2 sm:text-sm rounded-xl"
              onClick={filterSlideOver.toggle}
            >
              <Icon
                src="/icons/filter.svg"
                className="mr-2"
                color="bg-gray-800"
              />
              Filters
            </Button>
          </div>
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
            onChange={handleSearchChange}
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
            <option value="all">All</option>
            {areas.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
            <option value="others">Others</option>
          </Select>

          <div className="isolate mt-4 -space-y-px bg-white rounded-md shadow-sm">
            <label
              htmlFor="date-from"
              className="block relative focus-within:z-10 py-2 px-3 rounded-md rounded-b-none border focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600"
            >
              <span className="block text-sm font-medium text-gray-700">
                From
              </span>
              <input
                type="date"
                name="date-from"
                id="date-from"
                className="block p-0 w-full placeholder-gray-500 text-gray-900 border-0 focus:ring-0"
                value={from.format("YYYY-MM-DD")}
                min={dayjs(oldestDate).format("YYYY-MM-DD")}
                max={to.format("YYYY-MM-DD")}
                onChange={handleFromChange}
              />
            </label>
            <label
              htmlFor="date-from"
              className="block relative focus-within:z-10 py-2 px-3 rounded-md rounded-t-none border focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600"
            >
              <span className="block w-full text-sm font-medium text-gray-700">
                To
              </span>
              <input
                type="date"
                name="date-to"
                id="date-to"
                className="p-0 w-full placeholder-gray-500 text-gray-900 border-0 focus:ring-0"
                value={to.format("YYYY-MM-DD")}
                min={from.format("YYYY-MM-DD")}
                max={today.format("YYYY-MM-DD")}
                onChange={handleToChange}
              />
            </label>
          </div>

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

          {observations.length === 0 && (
            <div className="px-8 mt-8 mb-12 text-center">
              <Icon
                src="/icons/search.svg"
                className="mx-auto !w-10 !h-10"
                color="bg-gray-400"
              />
              <h3 className="mt-2 font-medium text-gray-900">
                No observations found
              </h3>
              <p className="mt-1 text-gray-500">
                {isFiltered
                  ? `No observations meets the given filter.`
                  : `No observations have been added.`}
              </p>
            </div>
          )}
        </ul>
      </div>

      <ObservationFilterSlideOver
        isOpen={filterSlideOver.isOn}
        oldestDate={oldestDate}
        areas={areas}
        onClose={filterSlideOver.toggle}
        onSet={async (values) => {
          await handleBulkChange({ ...values, search })
          filterSlideOver.toggle()
        }}
        onReset={async () => {
          await handleReset()
          filterSlideOver.toggle()
        }}
      />
    </RecordsLayout>
  )
}

const ObservationFilterSlideOver: FC<{
  isOpen: boolean
  oldestDate: string
  areas: Array<{ id: string; name: string | null }>
  onClose: () => void
  onSet: (value: { area: string; from: Dayjs; to: Dayjs }) => void
  onReset: () => void
}> = ({ onClose, isOpen, oldestDate, areas, onSet, onReset }) => {
  const query = useFilterQueries()

  const [area, setArea] = useState(query.area ?? "all")
  const [from, setFrom] = useState(dayjs(query.from || oldestDate))
  const [to, setTo] = useState(query.to ? dayjs(query.to) : today)

  return (
    <SlideOver show={isOpen} onClose={onClose} title="Filters">
      <div className="relative flex-1 px-4 sm:px-6 pt-3 mt-3 bg-gray-50 border-t">
        <Select
          defaultValue={area}
          value={area}
          onChange={(e) => setArea(e.target.value)}
          label="Area"
          name="area"
        >
          <option value="all">All</option>
          {areas.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
          <option value="others">Others</option>
        </Select>

        <div className="isolate mt-4 -space-y-px bg-white rounded-md shadow-sm">
          <label
            htmlFor="date-from"
            className="block relative focus-within:z-10 py-2 px-3 rounded-md rounded-b-none border focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600"
          >
            <span className="block text-sm font-medium text-gray-700">
              From
            </span>
            <input
              type="date"
              name="date-from"
              id="date-from"
              className="block p-0 w-full placeholder-gray-500 text-gray-900 border-0 focus:ring-0"
              value={from.format("YYYY-MM-DD")}
              min={dayjs(oldestDate).format("YYYY-MM-DD")}
              max={to.format("YYYY-MM-DD")}
              onChange={(e) => setFrom(dayjs(e.target.value || oldestDate))}
            />
          </label>
          <label
            htmlFor="date-from"
            className="block relative focus-within:z-10 py-2 px-3 rounded-md rounded-t-none border focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600"
          >
            <span className="block w-full text-sm font-medium text-gray-700">
              To
            </span>
            <input
              type="date"
              name="date-to"
              id="date-to"
              className="p-0 w-full placeholder-gray-500 text-gray-900 border-0 focus:ring-0"
              value={to.format("YYYY-MM-DD")}
              min={from.format("YYYY-MM-DD")}
              max={today.format("YYYY-MM-DD")}
              onChange={(e) => setTo(dayjs(e.target.value || today))}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-shrink-0 justify-end py-4 px-4 border-t">
        <Button
          variant="outline"
          onClick={() => {
            setArea("all")
            setFrom(dayjs(oldestDate))
            setTo(today)
            onReset()
          }}
        >
          Reset
        </Button>
        <Button className="ml-4" onClick={() => onSet({ area, from, to })}>
          Set
        </Button>
      </div>
    </SlideOver>
  )
}

const Observation: FC<{
  event_time: string
  short_desc: string | null
  long_desc: string | null
  areas: { name: string | null } | null
  images: Array<{ src: string | null }>
}> = ({ short_desc, areas, event_time, long_desc, images }) => (
  <li className="relative py-5 px-4 bg-white focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-600">
    <div className="flex justify-between space-x-3">
      <div className="block text-left truncate focus:outline-none">
        <span className="absolute inset-0" aria-hidden="true" />
        <p className="font-semibold text-gray-900 truncate">{short_desc}</p>
        <p className="font-semibold text-primary-600 truncate">
          {areas?.name ?? "Others"}
        </p>
      </div>

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
  const area = getQueryString(ctx, "area")
  const to = getQueryString(ctx, "to")
  const from = getQueryString(ctx, "from")

  let transformedArea: string | null | undefined = area
  if (area === "all") {
    transformedArea = undefined
  } else if (area === "others") {
    transformedArea = null
  }

  const oldestDate = await findOldestObservationDate(studentId)
  const observations = await findStudentObservations(studentId, {
    search,
    area: transformedArea,
    to: to ? dayjs(to) : undefined,
    from: from ? dayjs(from) : undefined,
  })
  const areas = await findCurriculumAreasByStudentId(studentId)

  return {
    props: {
      oldestDate:
        oldestDate?.event_time?.toISOString() ?? dayjs().toISOString(),
      areas: areas ?? [],
      observations: observations.map((o) => ({
        ...o,
        long_desc: o.long_desc ? markdownToHtml(o.long_desc) : o.long_desc,
        created_date: o.created_date?.toISOString() ?? "",
        event_time: o.event_time?.toISOString() ?? "",
        observation_to_images: o.observation_to_images?.map((image) => ({
          src: image.images.object_key
            ? generateOriginalUrl(image.images.object_key)
            : image.images.object_key,
        })),
      })),
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
    from: useQueryString("from"),
    to: useQueryString("to"),
    search: useQueryString("search"),
  }
}

export default RecordsPage
