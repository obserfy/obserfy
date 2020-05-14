import React, { FC } from "react"
import faker from "faker"
import { nanoid } from "nanoid"
import PagePlans from "./PagePlans"
import Layout from "../Layout/Layout"
import { Plans } from "../../api/useGetPlans"
import mockApi from "../../__mocks__/api"

// Component Details
export default {
  title: "Core|PagePlans",
  component: PagePlans,
  parameters: {
    componentSubtitle: "Just a simple PagePlans",
  },
}

// Stories
export const Basic: FC = () => {
  // Mock server
  mockApi.get("/schools/*/plans", (): Plans[] => [
    { id: nanoid(), title: faker.company.companyName() },
    { id: nanoid(), title: faker.company.companyName() },
  ])

  return <PagePlans />
}

export const WithLayout: FC = () => {
  // Mock server
  mockApi.get("/schools/*/plans", (): Plans[] => [
    { id: nanoid(), title: faker.company.companyName() },
    { id: nanoid(), title: faker.company.companyName() },
    { id: nanoid(), title: faker.company.companyName() },
    { id: nanoid(), title: faker.company.companyName() },
    { id: nanoid(), title: faker.company.companyName() },
    { id: nanoid(), title: faker.company.companyName() },
    { id: nanoid(), title: faker.company.companyName() },
  ])

  return (
    <Layout>
      <PagePlans />
    </Layout>
  )
}
