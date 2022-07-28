import dayjs from "dayjs"

describe("Test lesson plan features", function () {
  beforeEach(function () {
    // cy.clearSW()
    cy.registerVor()
    cy.createSchool()
    cy.createClass()
    cy.createStudent()
  })

  it("should be able to edit, create, and delete plans.", function () {
    cy.visit(`/dashboard/students/plans?studentId=${this.student.id}`)

    const lessonPlan1 = {
      title: "A Bold New Plan",
      description: "A Bold New description",
      link: "https://google.com",
    }

    const lessonPlan2 = {
      title: "Even bolder plan",
      description: "Crazier bolder description",
      link: "https://duckduckgo.com",
    }

    cy.get('[aria-label="next-date"]').click()

    // test create
    cy.contains("Add").click()
    cy.contains("Save").should("be.disabled")
    cy.contains("Title").type(lessonPlan1.title)
    cy.get("[data-cy=markdown-editor]").type(lessonPlan1.description)
    cy.get('[aria-label="URL"]').type(lessonPlan1.link)
    cy.get("[data-cy=add-link]").click()
    cy.contains(lessonPlan1.link).should("be.visible")
    cy.get("[data-cy=delete-link]").click()
    cy.contains(lessonPlan1.link).should("not.exist")
    cy.get('[aria-label="URL"]').type(lessonPlan1.link)
    cy.get("[data-cy=add-link]").click()

    cy.createStudent().then(() => {
      cy.get("[data-cy=add-student]").click()
      cy.contains(this.student.name).click()
      cy.get("[data-cy=confirm]").click()
      cy.contains(this.student.name).should("be.visible")
      cy.get("[data-cy=delete-student]").click()
      cy.contains(this.student.name).should("not.exist")

      cy.get("[data-cy=add-student]").click()
      cy.contains(this.student.name).click()
      cy.get("[data-cy=confirm]").click()
      cy.contains(this.student.name).should("be.visible")
    })
    cy.contains("Save").click()
    cy.contains(lessonPlan1.title).click()

    // Test edit
    cy.contains(lessonPlan1.title).should("be.visible")
    cy.contains(lessonPlan1.description).should("be.visible")
    cy.contains(lessonPlan1.link).should("be.visible")
    cy.contains(this.student.name.split(" ")[0]).should("be.visible")

    cy.get('[aria-label="edit-title"]').click()
    cy.contains("label", "Title").find("input").clear().type(lessonPlan2.title)
    cy.contains("Save").click()
    cy.contains(lessonPlan2.title).should("be.visible")

    cy.get('[aria-label="URL"]').type(lessonPlan2.link)
    cy.get("[data-cy=add-link]").click()
    cy.contains(lessonPlan2.link).should("be.visible")

    cy.get('[aria-label="edit-description"]').click()
    cy.get("[data-cy=markdown-editor]").type(lessonPlan2.description)
    cy.contains("Save").click()
    cy.contains(lessonPlan2.description).should("be.visible")

    cy.get("[data-cy=delete-student]").click()
    cy.createStudent().then(() => {
      cy.contains("Add More").click()
      cy.contains(this.student.name).click()
      cy.get("[data-cy=confirm]").click()
      cy.get("[data-cy=back-button]").click()
      cy.contains(lessonPlan2.title).click()
      cy.contains(this.student.name).should("be.visible")
      cy.get("[data-cy=delete-student]").click()

      cy.get("[data-cy=back-button]").click()
      cy.contains(lessonPlan2.title).click()
      cy.contains(this.student.name).should("not.exist")
    })

    cy.get("[data-cy=back-button]").click()
    cy.contains(lessonPlan2.title).click()
    cy.contains("Delete").click()
    cy.get("[data-cy=confirm]").click()
    cy.contains(lessonPlan2.title).should("not.exist")

    cy.contains("Today").click({ force: true })
    const repeatingPlan = {
      title: "A Bold Repeating New Plan",
      description: "A Bold Repeating New description",
      link: "https://google.com/repeat",
    }
    cy.contains("Add").click()
    cy.contains("Save").should("be.disabled")
    cy.contains("Title").type(repeatingPlan.title)
    cy.contains("Description").type(repeatingPlan.description)
    cy.contains("Daily").click()
    cy.get(`[data-cy="Repeat Until"]`).click()
    cy.get(`[data-cy="next-month"]`).click()
    cy.contains(dayjs().add(3, "day").daysInMonth()).click()
    cy.contains("Set").click()

    cy.contains("Save").click()
    cy.contains(repeatingPlan.title).should("be.visible")
    cy.get("[aria-label=next-date]").click()
    cy.contains(repeatingPlan.title).should("be.visible")
    cy.get("[aria-label=next-date]").click()
    cy.contains(repeatingPlan.title).should("be.visible")
    cy.get("[aria-label=next-date]").click()
    cy.contains(repeatingPlan.title).should("be.visible")

    // Regression test, should be able to delete class
    cy.visit("/dashboard/admin/class")
    cy.contains(this.class.name).click()
    cy.contains("Delete").click()
    cy.contains("Yes").click()
    cy.contains(this.class.name).should("not.exist")
  })
})
