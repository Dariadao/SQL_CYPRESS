describe("connect to test db", () => {
  it("can connect to test db", () => {
    cy.task(
      "queryDb",
      "CREATE TABLE Students(StudentId int, FirstName varchar(255),City varchar(255), StudentGroup varchar(255))"
    );
  });

  it("input entries", () => {
    cy.task(
      "queryDb",
      `INSERT INTO Students (StudentId, FirstName, City, StudentGroup) VALUES
  (1, "Ivan", "Barcelona", "02-2024"),
  (2, "Maria", "Tokio", "03-2023"),
  (3, "Andrey", "Milan", "02-2024")`
    ).then((result) => {
      cy.log(JSON.stringify(result));
      expect(result.affectedRows).to.equal(3);
    });
  });

  it("select", () => {
    cy.task(
      "queryDb",
      `SELECT FirstName FROM Students WHERE City ="Milan"`
    ).then((result) => {
      cy.log(JSON.stringify(result));
      expect(result[0].FirstName).to.equal("Andrey");
    });
  });

  it("input new data", () => {
    cy.task(
      "queryDb",
      `INSERT INTO Students (StudentId, FirstName, City, StudentGroup) VALUES
       (4, "Irina", "Moscow", "03-2023"),
       (5, "Oleg", "Paris", "03-2023")`
    ).then((result) => {
      cy.log(JSON.stringify(result));
      expect(result.affectedRows).to.equal(2);
    });
  });

  it("select updated group", () => {
    cy.task(
      "queryDb",
      `SELECT * FROM Students WHERE StudentGroup="03-2023"`
    ).then((result) => {
      cy.log(JSON.stringify(result));
      const students = [];
      for (let i = 0; i < result.length; i++) {
        students.push(result[i].FirstName);
      }
      cy.log(JSON.stringify(students));
      expect(students).to.include.members(["Maria", "Irina", "Oleg"]);
    });
  });

  it("can delete the db", () => {
    cy.task("queryDb", "DROP TABLE Students");
  });
});
