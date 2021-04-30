/// <reference types="cypress" />
import dayjs from "dayjs"
import faker from "faker"

const vorApi = (path: string) => `/api/v1${path}`

// Test helper commands ===============================================================
// @ts-ignore
const fixedClearCookies = () => cy.clearCookies({ domain: null })

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
    url: `/auth/register`,
    body: { email, password, name },
    form: true,
  })

  cy.request("POST", `/api/v1/schools`, {
    name: schoolName,
  }).then((result) => {
    window.localStorage.setItem("SCHOOL_ID", result.body.id)
  })

  cy.wrap({ name, email, password, schoolName }).as("vorUser")
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
  const studentName = `${faker.name.firstName()} ${faker.name.lastName()}`
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
Cypress.Commands.add("fixedClearCookies", fixedClearCookies)
Cypress.Commands.add("registerVor", registerVor)
Cypress.Commands.add("createClass", createClass)
Cypress.Commands.add("createSchool", createSchool)
Cypress.Commands.add("createStudent", createStudent)
Cypress.Commands.add("createGuardian", createGuardian)
Cypress.Commands.add("createObservation", createObservation)
Cypress.Commands.add("createLessonPlan", createLessonPlan)
