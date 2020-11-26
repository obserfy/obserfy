describe("test adding new student", () => {
  const faker = require("faker")

  beforeEach(() => {
    cy.clearSW()

    const name = faker.name.firstName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    const schoolName = faker.company.companyName()

    cy.request({
      method: "POST",
      url: "/auth/register",
      body: { email, password, name },
      form: true,
    })

    cy.request("POST", "/api/v1/schools", { name: schoolName }).then(
      (result) => {
        window.localStorage.setItem("SCHOOL_ID", result.body.id)
      }
    )
  })

  it("should be able to add student multiple times", () => {
    const studentName = faker.name.firstName()
    const studentId = faker.phone.phoneNumber()
    const notes = faker.lorem.lines(1)
    cy.visit("/dashboard/students/new")

    cy.contains("Name").type(studentName)
    cy.get(`[data-cy="Date of Birth"]`).click()
    cy.get(`[data-cy="confirm"]`).click()

    cy.get(`[data-cy="Date of Entry"]`).click()
    cy.get(`[data-cy="confirm"]`).click()

    cy.contains("Gender").find("select").select("Male")
    cy.contains("Student ID").type(studentId)
    cy.contains("Notes").type(notes)

    cy.contains("Save").click()

    cy.contains(studentName).should("be.visible")

    const newClass = {
      endTime: "2020-04-26T03:00:00.000Z",
      name: faker.company.companyName(),
      startTime: "2020-04-26T02:00:00.000Z",
      weekdays: [1],
    }
    cy.request(
      "POST",
      `/api/v1/schools/${localStorage.getItem("SCHOOL_ID")}/classes`,
      newClass
    )

    const studentName2 = faker.name.firstName()
    const studentId2 = faker.phone.phoneNumber()
    const notes2 = faker.lorem.lines(1)
    cy.get("[data-cy=addStudent]").click()

    cy.contains("Name")
      .find("input")
      .should("have.value", "")
      .type(studentName2)
    cy.get(`[data-cy="Date of Birth"]`).click()
    cy.get(`[data-cy=confirm]`).click()

    cy.get(`[data-cy="Date of Entry"]`).click()
    cy.get(`[data-cy=confirm]`).click()

    cy.contains("Gender").find("select").select("Male")
    cy.contains("Student ID").type(studentId2)
    cy.contains("Notes").type(notes2)

    cy.visit("/dashboard/students")
    cy.contains(studentName).should("be.visible")
    cy.visit("/dashboard/students/new")
    cy.contains("Name").find("input").should("have.value", studentName2)
    cy.get(`[data-cy="Date of Entry"]`).click()
    cy.get(`[data-cy="prev-month"]`).click()
    cy.get(`[data-cy="prev-year"]`).click()
    cy.contains("button", "5").click()
    cy.get(`[data-cy=confirm]`).click()
    cy.contains(newClass.name).click()
    cy.get("[data-cy=add-student]").click()

    const newGuardianName = faker.name.firstName()
    cy.contains("Guardian Name").type(newGuardianName)
    cy.contains("Create").click()
    cy.get("[data-cy=save-guardian]").click()

    cy.contains(newGuardianName).should("be.visible")

    cy.contains("Save").click()

    cy.contains(studentName2).should("be.visible")
  })
})
