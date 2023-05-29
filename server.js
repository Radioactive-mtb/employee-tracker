const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // TODO: Add MySQL password here
    password: "Timetotakeanap#27",
    database: "employee_db",
  },

  console.log(`Connected to the employee_db database.`)
);

var employeeTracker = function () {
  inquirer
    .prompt([
      {
        type: "list",
        name: "prompt",
        message: "Choose from the choices below.",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add an employee",
          "Add a role",
          "Add a department",
          "Update employee",
          "logout",
        ],
      },
    ])
    .then((answers) => {
      if (answers.prompt === "View all departments") {
        db.query(`SELECT * FROM departments`, (err, result) => {
          if (err) throw err;
          console.table(result);
          employeeTracker();
        });
      } else if (answers.prompt === "View all roles") {
        db.query(`SELECT * FROM roles`, (err, result) => {
          if (err) throw err;
          console.table(result);
          employeeTracker();
        });
      } else if (answers.prompt === "View all employees") {
        db.query(`SELECT * FROM employees`, (err, result) => {
          if (err) throw err;
          console.table(result);
          employeeTracker();
        });
      } else if (answers.prompt === "Add an employee") {
        db.query(`SELECT * FROM employees, roles`, (err, result) => {
          if (err) throw err;

          inquirer
            .prompt([
              {
                type: "input",
                name: "first_name",
                message: "Enter employees first name.",
              },
              {
                type: "input",
                name: "last_name",
                message: "Enter employees last name.",
              },
              {
                type: "list",
                name: "role",
                message: "Enter the employees role.",
                choices: () => {
                  var array = [];
                  for (var i = 0; i < result.length; i++) {
                    array.push(result[i].title);
                  }
                  var newArray = [...new Set(array)];
                  return newArray;
                },
              },
            ])
            .then((answers) => {
              for (var i = 0; i < result.length; i++) {
                if (result[i].title === answers.role) {
                  var role = result[i];
                }
              }
              db.query(
                `INSERT INTO employees (first_name, last_name, role_id) VALUES (?, ?, ?)`,
                [answers.first_name, answers.last_name, role.id]
              );
              if (err) throw err;
              console.log(
                `Added ${answers.first_name} ${answers.last_name} to the database.`
              );
              employeeTracker();
            });
        });
      } else if (answers.prompt === "Update employee") {
        db.query(`SELECT * FROM employees, roles`, (err, result) => {
          if (err) throw err;

          inquirer
            .prompt([
              {
                type: "list",
                name: "employee",
                message: "Choose employee to update role.",
                choices: () => {
                  var array = [];
                  for (var i = 0; i < result.length; i++) {
                    array.push(result[i].last_name);
                  }
                  var empArray = [...new Set(array)];
                  return empArray;
                },
              },
              {
                type: "list",
                name: "role",
                message: "Enter their new role",
                choices: () => {
                  var array = [];
                  for (var i = 0; i < result.length; i++) {
                    array.push(result[i].title);
                  }
                  var newArray = [...new Set(array)];
                  return newArray;
                },
              },
            ])
            .then((answers) => {
              for (var i = 0; i < result.length; i++) {
                if (result[i].last_name === answers.employee) {
                  var name = result[i];
                }
              }

              for (var i = 0; i < result.length; i++) {
                if (result[i].title === answers.role) {
                  var role = result[i];
                }
              }

              db.query(
                `UPDATE employees SET ? WHERE ?`,
                [{ role_id: role }, { last_name: name }],
                (err, result) => {
                  if (err) throw err;
                  console.log(
                    `Updated ${answers.employee} role to the database.`
                  );
                  employeeTracker();
                }
              );
            });
        });
      } else if (answers.prompt === "Add a department") {
        db.query(`SELECT * FROM departments`, (err, result) => {
          if (err) throw err;

          inquirer
            .prompt([
              {
                type: "input",
                name: "department",
                message: "Enter the new department.",
              },
            ])
            .then((answers) => {
              db.query(
                `INSERT INTO departments (dept_name) VALUES (?)`,
                [answers.department],
                (err, result) => {
                  if (err) throw err;
                  console.log(`Added ${answers.department} to the database.`);
                  employeeTracker();
                }
              );
            });
        });
      } else if (answers.prompt === "Add a role") {
        db.query(`SELECT * FROM departments, roles `, (err, result) => {
          if (err) throw err;

          inquirer
            .prompt([
              {
                type: "input",
                name: "role",
                message: "Enter the name of the new role.",
              },
              {
                type: "input",
                name: "salary",
                message: "Enter the salary for the new role.",
              },
              {
                type: "list",
                name: "department",
                message: "Which department does the role belong to?",
                choices: ["1", "2", "3", "4"],
              },
            ])
            .then((answers) => {
              for (var i = 0; i < result.length; i++) {
                if (result[i].name === answers.department) {
                  var department = result[i];
                }
              }
              db.query(
                `INSERT INTO roles (title, salary, dept_id) VALUES (?, ?, ?)`,
                [answers.role, answers.salary, answers.department],
                (err, result) => {
                  if (err) throw err;
                  console.log(`Added ${answers.role} to the database.`);
                  employeeTracker();
                }
              );
            });
        });
      } else if (answers.prompt === "logout") {
        console.log("You have logged out.");
      }
    });
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  employeeTracker();
});
