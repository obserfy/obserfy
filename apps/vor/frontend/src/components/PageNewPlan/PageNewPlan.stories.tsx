import React, { FC } from "react"
import faker from "faker"
import { nanoid } from "nanoid"
import PageNewPlan from "./PageNewPlan"
import Layout from "../Layout/Layout"
import mockApi from "../../__mocks__/api"
import { Class } from "../../api/useGetSchoolClasses"
import dayjs from "../../dayjs"

export default {
  title: "Page|Plans/PageNewPlan",
  component: PageNewPlan,
  parameters: {
    componentSubtitle: "Just a simple PageNewPlan",
  },
}

export const Basic: FC = () => <PageNewPlan />

export const WithLayout: FC = () => {
  mockApi.get("/schools/*/class", (): Class[] => {
    return [
      {
        id: nanoid(),
        name: faker.name.jobTitle(),
        weekdays: [],
        endTime: dayjs().toDate(),
        startTime: dayjs().toDate(),
      },
      {
        id: nanoid(),
        name: faker.name.firstName(),
        weekdays: [],
        endTime: dayjs().toDate(),
        startTime: dayjs().toDate(),
      },
    ]
  })
  return (
    <Layout>
      <PageNewPlan />
    </Layout>
  )
}
