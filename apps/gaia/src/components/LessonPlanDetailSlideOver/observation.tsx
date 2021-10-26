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
  <div className="p-4 lg:p-6 bg-gray-50 border-b">
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
    <li className="p-4 mb-2 bg-white rounded-xl border border-gray-200">
      <div className="flex items-start">
        {long_desc && (
          <div
            className="mr-2 mb-2 max-w-none text-gray-700 prose"
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
          className="flex flex-shrink-0 ml-2 text-sm text-gray-500 whitespace-nowrap"
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
        <Button className="sm:ml-3 w-full sm:w-auto text-base sm:text-sm hover:!bg-red-700 focus:!ring-red-500 !bg-red-600">
          Sign Out
        </Button>
      </a>
    }
    actionButton={
      <div className="flex flex-shrink-0 justify-center items-center mx-auto sm:mx-0 w-12 sm:w-10 h-12 sm:h-10 bg-red-100 rounded-full">
        <Icon
          src="/icons/log-out.svg"
          className="w-6 h-6"
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
  <Menu as="div" className="inline-block relative ml-auto text-left">
    <div>
      <Menu.Button className="inline-flex justify-center p-1 w-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-100 shadow-sm focus:outline-none">
        <Icon src="/icons/dots-horizontal.svg" className="!w-6 !h-6" />
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
      <Menu.Items className="absolute right-0 z-20 mt-2 w-56 bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right focus:outline-none">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <a
                href="#"
                className={clsx(
                  active ? "text-gray-900 bg-gray-100" : "text-gray-700",
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
                  active ? "text-gray-900 bg-gray-100" : "text-gray-700",
                  "flex items-center py-2 px-4 text-sm"
                )}
              >
                <Icon
                  src="/icons/trash.svg"
                  className="mr-4 !w-4 !h-4"
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
    <div className="flex overflow-hidden flex-col h-80 bg-white rounded-xl border border-gray-200 focus-within:ring-2 ring-primary-500">
      <label
        htmlFor="new-observation"
        className="w-full h-full outline-none focus:outline-none"
      >
        <span className="sr-only">Observation</span>
        <textarea
          id="new-observation"
          placeholder="Post an observation..."
          className="p-4 w-full h-full placeholder-gray-400 border-none resize-none focus:!outline-none"
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
            className="animate-spin !w-4 !h-4"
          />
        )}
        Submit
      </Button>
    </div>
  )
}
