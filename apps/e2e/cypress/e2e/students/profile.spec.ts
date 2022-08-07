import faker from "faker"

describe("test student profile page", function () {
  beforeEach(function () {
    // cy.clearSW()
    cy.registerVor()
  })

  it("should be able to edit all student data.", function () {
    cy.visit("/")

    // Create student
    let studentName = "Carol"
    cy.get("main").within(() => {
      cy.get("[data-cy=new-student-button]").click()
    })
    cy.contains("Name").type(studentName)
    cy.contains("Save").click()

    // Create observation, Check observation content
    const shortDesc = "He is improving in a rapid rate"
    const details =
      "Bla bla black sheep have you any war. Yes shire yes shire tea bag fool"
    cy.contains(studentName).should("be.visible")
    cy.contains(studentName).click()
    cy.contains("Observation").click()
    cy.contains("Short Description").type(shortDesc)
    cy.get("[data-cy=markdown-editor]").type(details)
    cy.contains("Save").click()
    cy.get("[data-cy=observation-short-desc]")
      .contains(shortDesc)
      .should("be.visible")
    cy.get("[data-cy=observation-long-desc]")
      .contains(details)
      .should("be.visible")

    // Change student name
    studentName = "Jane Doe"
    cy.contains("Profile").click()
    cy.get("[aria-label=edit-name]").click()
    cy.contains("label", "Name").find("input").clear().type(studentName)
    cy.contains("Save").click()
    cy.contains(studentName).should("be.visible")

    // Change student dob
    // cy.contains("Name").find("input").clear().type("Jane Doe")
    // cy.contains("Date of Birth").click()
    // cy.contains("Month").find("select").select("6")
    // cy.get("[data-cy=confirm]").click()
    // cy.contains("Save").click()

    // Test changing status
    cy.contains("Set As Inactive", { matchCase: false }).click()
    cy.contains("Yes").click()
    cy.wait(100)
    cy.get("[data-cy=active-button]").should("be.visible")
    cy.get("[data-cy=inactive-button]").should("not.exist")

    const guardianName = faker.name.firstName()
    cy.get("[data-cy=add-guardian]").click()
    cy.contains("Create").click()
    cy.contains("Guardian Name").type(guardianName)
    cy.contains("button", "Add").click()
    cy.contains(guardianName).should("be.visible")

    // TODO: enable this after we can remove guardian
    // Remove guardian
    // cy.get("[data-cy=remove-guardian]").click()
    // cy.get("[data-cy=remove]").click()
    // cy.contains(guardianName).should("be.visible")

    // Re-add guardian
    // cy.wait(500)
    // cy.get("[data-cy=add-guardian]").click()
    // cy.get("[aria-label=Relationship]").select("1")
    // cy.contains("Save").click()
    // cy.contains(guardianName).should("be.visible")

    // Go back to student profile page.
    // cy.contains("Student Profile").click()
    cy.contains(guardianName).should("be.visible")

    // Go back to overview
    cy.get("[data-cy=back-button]").click()

    // Edit observation
    // cy.url().should("contains", "students")
    cy.contains(shortDesc).click()
    cy.get("[data-cy=edit-details]").click()
    cy.get("[data-cy=markdown-editor]").type("Some additional text")
    cy.contains("Save").click()
    cy.contains("Some additional text").should("be.visible")

    // Delete observation
    cy.get("[data-cy=delete-observation]").should("be.visible").click()
    cy.contains("button", "Yes").click()
    cy.contains(shortDesc).should("not.exist")

    // Go to curriculum
    cy.contains("Go to Curriculum").click()

    // Go to settings
    // Go back to curriculum
    // Create default curriculum TODO: This test will be flaky.
    cy.wait(100).contains("Use Montessori").click()
    cy.contains("Math").should("exist")

    // Go to a student
    cy.get("[data-cy=navbar-students]").click()
    // .waitForRouteChange()
    cy.url().should("contains", "students")
    cy.contains(studentName).click()
    // .waitForRouteChange()

    // Click on tabs
    cy.contains("Math").click()

    // Open all progress
    cy.contains("See All ").click()
    // .waitForRouteChange()

    // Change something to Practiced
    cy.contains("Number Rods").click()
    cy.contains("Save").should("be.disabled")
    cy.contains("Practiced").click()
    cy.contains("Save").click()

    // Go back and see if it shows up
    cy.contains("Practiced").should("be.visible")
    cy.get("[data-cy=back-button]").click({ force: true })
    // .waitForRouteChange()

    // Change to master
    cy.contains("See All Math").should("be.visible")
    cy.contains("Practiced").should("be.visible").click()

    cy.contains("Mastered").click()
    cy.contains("Save").click()

    // Make sure it shows up
    cy.contains("Mastered").should("be.visible")
  })
})
