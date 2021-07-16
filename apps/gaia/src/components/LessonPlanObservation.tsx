import { FC, useState } from "react"
import { Dayjs } from "../utils/dayjs"
import Button from "./Button/Button"
import { EditObservationForm } from "./EditObservationForm"
import Markdown from "./Markdown/Markdown"

const LessonPlanObservation: FC<{
  id: string
  observation: string
  createdAt: Dayjs
}> = ({ id, observation, createdAt }) => {
  const [isEditing, setIsEditing] = useState(false)
  return (
    <div className="px-3 mt-2 text-gray-700 flex w-full">
      <div className="rounded-full bg-black w-1 flex-shrink-0 mr-3" />

      <div className="w-full">
        {isEditing && (
          <EditObservationForm
            observationId={id}
            original={observation}
            onDismiss={() => setIsEditing(false)}
          />
        )}

        {!isEditing && (
          <>
            <Markdown markdown={observation} />
            <div className="flex mt-2 item-center w-full">
              <div className="text-sm">{createdAt.format("HH:mm")}</div>
              <Button
                outline
                className="ml-auto mr-3 text-sm underline cursor-pointer border-none p-0"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default LessonPlanObservation
