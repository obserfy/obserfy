import { Menu, Transition } from "@headlessui/react"
import clsx from "clsx"
import { FC, Fragment, useState } from "react"
import {
  guardians as Guardians,
  observations as Observations,
  users as Users,
} from "@prisma/client"
import dayjs, { Dayjs } from "$lib/dayjs"
import AlertDialog from "$components/AlertDialog"
import Button from "$components/Button/Button"
import Icon from "$components/Icon/Icon"
import usePostPlanObservation from "$hooks/api/usePostPlanObservation"
import useToggle from "$hooks/useToggle"

export const ObservationsList: FC<{
  lessonPlanId: string
  studentId: string
  observations: (Observations & {
    guardians: Guardians | null
    users: Users | null
  })[]
}> = ({ observations, lessonPlanId, studentId }) => (
  <div className="border-b bg-gray-50 p-4 lg:p-6">
    <h4 className="mb-2 text-gray-600">Observations</h4>
    {observations.length > 0 && (
      <ul className="pb-4">
        {observations.map((o) => (
          <Observation
            key={o.id}
            long_desc={o.long_desc}
            event_time={dayjs(o.event_time)}
            userName={o.users?.name}
            guardianName={o.guardians?.name}
          />
        ))}
      </ul>
    )}

    <PostObservationForm lessonPlanId={lessonPlanId} studentId={studentId} />
  </div>
)

const Observation: FC<{
  event_time: Dayjs
  long_desc: string | null
  userName?: string | null
  guardianName?: string | null
}> = ({ event_time, long_desc, guardianName, userName }) => {
  const deleteDialog = useToggle()
  const editForm = useToggle()

  return (
    <li className="mb-2 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-start">
        {long_desc && (
          <div
            className="prose mr-2 mb-2 max-w-none text-gray-700"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: long_desc }}
          />
        )}

        <ObservationDropdown onDeleteClick={() => {}} onEditClick={() => {}} />
      </div>

      <div className="flex">
        <p className="text-sm text-gray-500">{userName || guardianName}</p>
        <time
          dateTime={event_time.toISOString()}
          className="ml-2 flex shrink-0 whitespace-nowrap text-sm text-gray-500"
        >
          {event_time.format("DD MMM YYYY")}
        </time>
      </div>
    </li>
  )
}

const DeleteObservationDialog: FC<{
  isOpen: boolean
  close: () => void
}> = ({ isOpen, close }) => (
  <AlertDialog
    isOpen={isOpen}
    close={close}
    title="Delete Observation"
    icon={
      <a>
        <Button className="w-full !bg-red-600 text-base hover:!bg-red-700 focus:!ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
          Sign Out
        </Button>
      </a>
    }
    actionButton={
      <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
        <Icon
          src="/icons/log-out.svg"
          className="h-6 w-6"
          color="bg-red-600"
          aria-hidden="true"
        />
      </div>
    }
  />
)

const ObservationDropdown: FC<{
  onEditClick: () => void
  onDeleteClick: () => void
}> = () => (
  <Menu as="div" className="relative ml-auto inline-block text-left">
    <div>
      <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white p-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-100">
        <Icon src="/icons/dots-horizontal.svg" className="!h-6 !w-6" />
      </Menu.Button>
    </div>

    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <a
                href="#"
                className={clsx(
                  active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                  "flex items-center py-2 px-4 text-sm"
                )}
              >
                <Icon
                  src="/icons/edit.svg"
                  className="mr-4"
                  color="bg-gray-500"
                />
                Edit
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                href="#"
                className={clsx(
                  active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                  "flex items-center py-2 px-4 text-sm"
                )}
              >
                <Icon
                  src="/icons/trash.svg"
                  className="mr-4 !h-4 !w-4"
                  color="bg-gray-500"
                />
                Delete
              </a>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Transition>
  </Menu>
)

export const PostObservationForm: FC<{
  lessonPlanId?: string
  studentId?: string
}> = ({ lessonPlanId, studentId }) => {
  const [observation, setObservation] = useState("")

  const { mutateAsync, isLoading } = usePostPlanObservation(lessonPlanId)

  return (
    <div className="flex h-80 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white ring-primary-500 focus-within:ring-2">
      <label
        htmlFor="new-observation"
        className="h-full w-full outline-none focus:outline-none"
      >
        <span className="sr-only">Observation</span>
        <textarea
          id="new-observation"
          placeholder="Post an observation..."
          className="h-full w-full resize-none border-none p-4 placeholder:text-gray-400 focus:!outline-none"
          value={observation}
          onChange={(e) => {
            setObservation(e.target.value)
          }}
        />
      </label>
      <Button
        className="m-2 ml-auto"
        disabled={observation === undefined || observation === "" || isLoading}
        onClick={async () => {
          if (studentId) {
            await mutateAsync({
              observation,
              studentId,
            })
            setObservation("")
          }
        }}
      >
        {isLoading && (
          <Icon
            src="/icons/spinner.svg"
            color="bg-white"
            className="!h-4 !w-4 animate-spin"
          />
        )}
        Submit
      </Button>
    </div>
  )
}
