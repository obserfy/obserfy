import { useState } from "react"

const useVisibilityState = () => {
  const [visible, setVisible] = useState(false)
  const hide = () => setVisible(false)
  const show = () => setVisible(true)

  return { visible, hide, show }
}

export default useVisibilityState
