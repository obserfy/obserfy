import planId from "$api/plans/[planId]"
import Button from "$components/Button/Button"
import Icon from "$components/Icon/Icon"
import useDeleteObservation from "$hooks/api/useDeleteObservation"
import useDeletePlanObservation from "$hooks/api/useDeletePlanObservation"
import usePatchPlanObservation from "$hooks/api/usePatchPlanObservation"
import usePostPlanObservation from "$hooks/api/usePostPlanObservation"
import useToggle from "$hooks/useToggle"
import dayjs, { Dayjs } from "$lib/dayjs"
import { Menu, Transition } from "@headlessui/react"
import {
  guardians as Guardians,
  observations as Observations,
  users as Users,
} from "@prisma/client"
import clsx from "clsx"
import { FC, Fragment, useState } from "react"

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
            observationId={o.id}
            long_desc={o.long_desc}
            event_time={dayjs(o.event_time)}
            userName={o.users?.name}
            guardianName={o.guardians?.name}
            lessonPlanId={lessonPlanId}
          />
        ))}
      </ul>
    )}

    <PostObservationForm lessonPlanId={lessonPlanId} studentId={studentId} />
  </div>
)

const Observation: FC<{
  observationId: string
  event_time: Dayjs
  long_desc: string | null
  userName?: string | null
  guardianName?: string | null
  lessonPlanId: string
}> = ({
  lessonPlanId,
  event_time,
  long_desc,
  guardianName,
  userName,
  observationId,
}) => {
  const { mutate, isLoading } = useDeletePlanObservation(
    lessonPlanId,
    observationId
  )

  const deleteDialog = useToggle()
  const editForm = useToggle()

  if (editForm.isOn) {
    return (
      <EditObservation
        lessonPlanId={lessonPlanId}
        observationId={observationId}
        onDismiss={editForm.toggle}
        original={long_desc ?? ""}
      />
    )
  }

  return (
    <li className="mb-2 rounded-xl border border-gray-200 bg-white p-4">
      <div className="relative flex items-start">
        {long_desc && (
          <div
            className="prose mr-2 mb-2 max-w-none text-gray-700"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: long_desc }}
          />
        )}

        {deleteDialog.isOn ? (
          <>
            <Button
              variant="outline"
              className="absolute right-8 ml-auto mr-2 !p-2"
              onClick={deleteDialog.toggle}
              disabled={isLoading}
            >
              <Icon src="/icons/close.svg" className="!h-4 !w-4 " />
            </Button>

            <Button
              variant={"outline"}
              className="ml-auto border-red-200/50 bg-red-50 !p-2 hover:bg-red-300"
              onClick={async () => {
                await mutate()
              }}
              disabled={isLoading}
            >
              {isLoading && (
                <Icon
                  src="/icons/spinner.svg"
                  color="bg-white"
                  className="!h-4 !w-4 animate-spin"
                />
              )}
              <Icon src="/icons/trash.svg" className="!h-4 !w-4 !bg-red-900 " />
            </Button>
          </>
        ) : (
          <ObservationDropdown
            onDeleteClick={deleteDialog.toggle}
            onEditClick={editForm.toggle}
          />
        )}
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

export const EditObservation: FC<{
  lessonPlanId: string
  observationId: string
  onDismiss: () => void
  original: string
}> = ({ lessonPlanId, observationId, original, onDismiss }) => {
  const [observation, setObservation] = useState(original)

  const { mutateAsync, isLoading } = usePatchPlanObservation(
    lessonPlanId,
    observationId
  )

  return (
    <div className="flex h-60 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white ring-primary-500 focus-within:ring-2">
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

      <div className={"m-2 flex"}>
        <Button
          variant={"outline"}
          className="ml-auto text-red-900"
          onClick={onDismiss}
        >
          Cancel
        </Button>
        <Button
          className="ml-2"
          disabled={observation === "" || isLoading}
          onClick={async () => {
            if (observation) {
              await mutateAsync({ observation })
              onDismiss()
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
    </div>
  )
}

const ObservationDropdown: FC<{
  onEditClick: () => void
  onDeleteClick: () => void
}> = ({ onDeleteClick, onEditClick }) => (
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
              <button
                className={clsx(
                  active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                  "flex w-full items-center py-2 px-4 text-sm"
                )}
                onClick={onEditClick}
              >
                <Icon
                  src="/icons/edit.svg"
                  className="mr-4"
                  color="bg-gray-500"
                />
                Edit
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={clsx(
                  active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                  "flex w-full items-center py-2 px-4 text-sm"
                )}
                onClick={onDeleteClick}
              >
                <Icon
                  src="/icons/trash.svg"
                  className="mr-4 !h-4 !w-4"
                  color="bg-gray-500"
                />
                Delete
              </button>
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
