import * as faker from "faker"
import { Schools } from "../../src/hooks/students/useQueryAllSchool"
import { setSchoolIdState } from "../../src/hooks/schoolIdState"

describe("Student management flow test", () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.fixture<UserFixture>("user").then(user => {
      cy.request({
        method: "POST",
        form: true,
        url: "/auth/register",
        body: {
          name: user.name,
          email: user.email,
          password: user.password
        }
      })

      cy.request({
        method: "POST",
        form: true,
        url: "/auth/login",
        body: {
          email: user.email,
          password: user.password
        }
      })
    })

    cy.fixture<SchoolFixture>("school").then(school => {
      cy.request({
        method: "POST",
        url: "/api/v1/schools",
        body: { name: school.name }
      }).then(response => {
        const { id }: Schools = response.body
        setSchoolIdState(id)
      })
    })
  })

  it("should be able to create new student and edit its name", () => {
    const studentName = faker.name.firstName()

    cy.visit("/")

    cy.get("[data-cy=addStudent]").click()
    cy.contains("Full Name")
      .click()
      .type(studentName)

    cy.get("[data-cy=dialogPositiveAction]").click()
    cy.contains(studentName)
      .should("exist")
      .click()

    // Change student name
    const newStudentName = faker.name.firstName()
    cy.contains(/Edit Student/i).click()
    cy.contains("Name")
      .click()
      .type(`{selectall}${newStudentName}`)
    cy.contains(/Save/i).click()
    cy.contains(newStudentName)
      .should("exist")
      .click()
    cy.contains(studentName).should("not.exist")

    // Delete student
    cy.contains(/Edit Student/i).click()
    cy.contains(/delete/i).click()
    cy.contains(newStudentName).should("not.exist")
  })
})
