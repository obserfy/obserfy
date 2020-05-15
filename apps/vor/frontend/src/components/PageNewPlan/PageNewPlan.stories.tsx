import React, { FC } from "react"
import faker from "faker"
import { nanoid } from "nanoid"
import { action } from "@storybook/addon-actions"
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

export const Basic: FC = () => <PageNewPlan chosenDate="2020-02-01" />

export const WithLayout: FC = () => {
  mockApi.post("/class/*/plans", async (schema, request) => {
    action("New class posted")(request.url, request.requestBody)
  })
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
      <PageNewPlan chosenDate="2020-02-01" />
    </Layout>
  )
}
