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
    <div className="mt-2 flex w-full px-3 text-gray-700">
      <div className="mr-3 w-1 shrink-0 rounded-full bg-black" />

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
            <div className="item-center mt-2 flex w-full">
              <div className="text-sm">{createdAt.format("HH:mm")}</div>
              <Button
                variant="outline"
                className="mr-3 ml-auto cursor-pointer border-none p-0 text-sm underline"
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
