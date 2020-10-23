import { ChangeEventHandler, useState } from "react"

/**
 * Hook specialized for handling input element state
 * */
const useInputState = (defaultState?: string) => {
  const [state, setState] = useState<string>(defaultState ?? "")

  const updateState: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState(e.target.value)
  }

  return [state, updateState] as const
}

export default useInputState
