import * as Sentry from "@sentry/node"
import { FC, useState } from "react"
import usePostPlanObservation from "../hooks/api/usePostPlanObservation"
import Button from "./Button/Button"
import Textarea from "./Textarea/Textarea"

const AddObservationForm: FC<{
  onDismiss: () => void
  planId: string
  childId: string
}> = ({ onDismiss, planId, childId }) => {
  const [loading, setLoading] = useState(false)
  const postObservation = usePostPlanObservation(planId)
  const [observation, setObservation] = useState("")

  const handleSubmit = async () => {
    try {
      setLoading(true)
      await postObservation.mutateAsync({
        observation,
        childId,
      })
      onDismiss()
    } catch (e) {
      Sentry.captureException(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="px-3 w-full">
        <Textarea
          className="w-full mt-3"
          label="Observation"
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="flex ml-auto">
        <Button
          outline
          className="ml-auto mr-3 mt-3"
          onClick={onDismiss}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          className="ml-auto mr-3 mt-3"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Loading" : "Post"}
        </Button>
      </div>
    </>
  )
}

export default AddObservationForm
