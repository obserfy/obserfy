import { FC, useState } from "react"
import { Dayjs } from "$lib/dayjs"
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
    <div className="flex px-3 mt-2 w-full text-gray-700">
      <div className="flex-shrink-0 mr-3 w-1 bg-black rounded-full" />

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
            <div className="flex mt-2 w-full item-center">
              <div className="text-sm">{createdAt.format("HH:mm")}</div>
              <Button
                variant="outline"
                className="p-0 mr-3 ml-auto text-sm underline border-none cursor-pointer"
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
