// Context to persist and share form state across pages
import { createContext, FC, useContext } from "react"
import { Updater, useImmer } from "use-immer"
import { Dayjs } from "../../dayjs"
import { GuardianRelationship } from "../../hooks/api/students/usePostNewStudent"

export const newStudentFormDefaultState = {
  classes: [] as string[],
  guardians: [] as Array<{
    id: string
    relationship: GuardianRelationship
  }>,
  dateOfEntry: undefined as Dayjs | undefined,
  dateOfBirth: undefined as Dayjs | undefined,
  gender: 0,
  note: "",
  customId: "",
  profileImageId: "",
  name: "",
}

const defaultSetState: Updater<typeof newStudentFormDefaultState> = () => {}

const NewStudentFormContext = createContext({
  state: newStudentFormDefaultState,
  setState: defaultSetState,
})

export const NewStudentFormProvider: FC = ({ children }) => {
  const [state, setState] = useImmer(newStudentFormDefaultState)

  return (
    <NewStudentFormContext.Provider value={{ state, setState }}>
      {children}
    </NewStudentFormContext.Provider>
  )
}

export const useNewStudentFormContext = () => useContext(NewStudentFormContext)
