import React, { FC } from "react"
import { Server } from "miragejs"
import faker from "faker"
import PagePlans from "./PagePlans"
import Layout from "../Layout/Layout"
import { Plans } from "../../api/useGetPlans"

export default {
  title: "Core|PagePlans",
  component: PagePlans,
  parameters: {
    componentSubtitle: "Just a simple PagePlans",
  },
}

new Server({
  routes() {
    this.namespace = "/api/v1"

    this.get("/schools/*/plans", (): Plans[] => [
      { title: faker.company.companyName() },
      { title: faker.company.companyName() },
      { title: faker.company.companyName() },
      { title: faker.company.companyName() },
      { title: faker.company.companyName() },
      { title: faker.company.companyName() },
      { title: faker.company.companyName() },
    ])
  },
})

export const Basic: FC = () => <PagePlans />
export const WithLayout: FC = () => (
  <Layout>
    <PagePlans />
  </Layout>
)
