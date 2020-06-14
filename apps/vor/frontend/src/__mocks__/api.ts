// eslint-disable-next-line import/no-extraneous-dependencies
import { Server } from "miragejs"

/**
 * This is a global mock for API. Use only on test and storybook.
 * DO NOT IMPORT IN PRODUCTION
 * */
const mockApi = new Server({ namespace: "/api/v1" })

export default mockApi
