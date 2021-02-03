/// <reference types="cypress" />
const dayjs = require("dayjs")
const faker = require("faker")
const { seal, loginTestUser, getUserInfo } = require("./auth0")

declare namespace Cypress {
  type CustomCommand<T extends (...args: any) => void> = (
    ...args: Parameters<T>
  ) => Chainable<Element>

  interface Chainable {
    // from plugins
    attachFile: CustomCommand<(fixturePath: string) => void>

    // our custom made commands
    clearSW: CustomCommand<typeof clearSW>
    visitVor: CustomCommand<typeof visitVor>
    visitGaia: CustomCommand<typeof visitGaia>
    fixedClearCookies: CustomCommand<typeof fixedClearCookies>
    registerVor: CustomCommand<typeof registerVor>
    createClass: CustomCommand<typeof createClass>
    gaiaLogin: CustomCommand<typeof gaiaLogin>
    createSchool: CustomCommand<typeof createSchool>
    createStudent: CustomCommand<typeof createStudent>
    createGuardian: CustomCommand<typeof createGuardian>
    createObservation: CustomCommand<typeof createObservation>
    createLessonPlan: CustomCommand<typeof createLessonPlan>
  }
}

const vorApi = (path: string) => `${Cypress.env("VOR_HOST")}/api/v1${path}`

// Test helper commands ===============================================================
// @ts-ignore
const fixedClearCookies = () => cy.clearCookies({ domain: null })
const visitVor = (path: string) => cy.visit(Cypress.env("VOR_HOST") + path)
const visitGaia = (path: string) => cy.visit(Cypress.env("GAIA_HOST") + path)
const clearSW = () => {
  if (typeof window !== "undefined" && window.navigator.serviceWorker) {
    window.navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister()
      })
    })
  }
}

// Auth related commands ===============================================================
// Vor *************************
const registerVor = () => {
  const name = faker.name.firstName()
  const email = faker.internet.email()
  const password = faker.internet.password()
  const schoolName = faker.company.companyName()

  cy.request({
    method: "POST",
    url: `${Cypress.env("VOR_HOST")}/auth/register`,
    body: { email, password, name },
    form: true,
  })

  cy.request("POST", `${Cypress.env("VOR_HOST")}/api/v1/schools`, {
    name: schoolName,
  }).then((result) => {
    window.localStorage.setItem("SCHOOL_ID", result.body.id)
  })

  cy.wrap({ name, email, password, schoolName }).as("vorUser")
}

// gaia **************************
const gaiaLogin = () => {
  cy.setCookie("a0:state", "some-random-state", {
    domain: Cypress.env("GAIA_DOMAIN"),
  })

  cy.wrap(null)
    .then(() => loginTestUser())
    .then((response) => {
      const { accessToken, expiresIn, idToken, scope } = response
      return getUserInfo(accessToken).then((user: any) => {
        const persistedSession = {
          user,
          idToken,
          accessToken,
          accessTokenScope: scope,
          accessTokenExpiresAt: Date.now() + expiresIn,
          createdAt: Date.now(),
        }

        return seal(persistedSession).then((encryptedSession: any) => {
          cy.setCookie("a0:session", encryptedSession, {
            domain: Cypress.env("GAIA_DOMAIN"),
          })
        })
      })
    })
}

// Data Input Commands ===============================================================
const createSchool = () => {
  const schoolName = faker.company.companyName()
  cy.request("POST", vorApi("/schools"), {
    name: schoolName,
  }).then((result) => {
    window.localStorage.setItem("SCHOOL_ID", result.body.id)
    cy.wrap(result.body).as("school")
  })
}

const createStudent = () => {
  const studentName = faker.name.firstName()
  const schoolId = localStorage.getItem("SCHOOL_ID")
  cy.request("POST", vorApi(`/schools/${schoolId}/students`), {
    name: studentName,
  }).then((response) => {
    cy.wrap({ id: response.body.id, name: studentName }).as("student")
  })
}

const createClass = () => {
  const newClass = {
    endTime: "2020-04-26T03:00:00.000Z",
    name: faker.company.companyName(),
    startTime: "2020-04-26T02:00:00.000Z",
    weekdays: [1],
  }
  const schoolId = localStorage.getItem("SCHOOL_ID")
  cy.request("POST", vorApi(`/schools/${schoolId}/classes`), newClass).then(
    (response) => {
      cy.wrap({ id: response.body.id, ...newClass }).as("class")
    }
  )
}

const createGuardian = (studentId: string) => {
  const schoolId = localStorage.getItem("SCHOOL_ID")
  const guardian = {
    name: faker.name.firstName(),
    email: "gilfoyle@obserfy.com",
    phone: faker.phone.phoneNumber(),
    address: faker.address.streetAddress(true),
    note: faker.lorem.paragraph(2),
    relationship: 1,
    studentId,
  }
  cy.request("POST", vorApi(`/schools/${schoolId}/guardians`), guardian).then(
    (response) => {
      cy.wrap({ id: response.body.id, ...guardian }).as("guardian")
    }
  )
}

const createObservation = (studentId: string, visibleToGuardians?: boolean) => {
  const observation = {
    shortDesc: faker.lorem.paragraph(1),
    longDesc: faker.lorem.paragraph(1),
    visibleToGuardians,
  }
  cy.request(
    "POST",
    vorApi(`/students/${studentId}/observations`),
    observation
  ).then((response) => {
    cy.wrap(response.body).as("observation")
  })
}

const createLessonPlan = (studentId: string) => {
  const schoolId = localStorage.getItem("SCHOOL_ID")
  const plan = {
    date: dayjs().startOf("day").toISOString(),
    title: faker.lorem.paragraph(1),
    description: faker.lorem.paragraph(1),
    students: [studentId],
  }
  cy.request("POST", vorApi(`/schools/${schoolId}/plans`), plan).then(
    (response) => {
      cy.wrap(response.body).as("lessonPlan")
    }
  )
}

Cypress.Commands.add("clearSW", clearSW)
Cypress.Commands.add("visitVor", visitVor)
Cypress.Commands.add("visitGaia", visitGaia)
Cypress.Commands.add("fixedClearCookies", fixedClearCookies)
Cypress.Commands.add("registerVor", registerVor)
Cypress.Commands.add("createClass", createClass)
Cypress.Commands.add("gaiaLogin", gaiaLogin)
Cypress.Commands.add("createSchool", createSchool)
Cypress.Commands.add("createStudent", createStudent)
Cypress.Commands.add("createGuardian", createGuardian)
Cypress.Commands.add("createObservation", createObservation)
Cypress.Commands.add("createLessonPlan", createLessonPlan)
