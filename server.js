const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require("inquirer");
const fs = require("fs");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password
    password: 'saz@12345',

    database: 'Employee_db'
},
    console.log(`Connected to the database.`)
);

// View All Departments

function View_All_Departments() {

    connection.connect(function (err) {
        if (err) throw err;
        connection.query("SELECT dp_id, dp_name FROM Department", function (err, result, fields) {
            if (err) throw err;
            console.table(result);
            Select_options();
        });
    });
}

// View All Employee Roll
function View_All_EmployeeRoll() {
    connection.connect(function (err) {
        if (err) throw err;
        connection.query("SELECT ro_id, ro_title, ro_salary, dp_name FROM emp_role JOIN department ON emp_role.ro_dp_id=department.dp_id", function (err, result, fields) {
            if (err) throw err;
            console.table(result);
            Select_options();
        });
    });
}

// View_All_Employeeto_System 
function View_All_Employee() {
    connection.connect(function (err) {
        if (err) throw err;
        connection.query("SELECT employee.emp_id AS 'First Name', employee.emp_first_name AS 'First Name', employee.emp_last_name AS 'Last Name', emp_role.ro_title AS 'Employee Roll',department.dp_name AS 'Employee Department',emp_role.ro_salary AS 'Employee Salary' , CONCAT(manager.emp_first_name, ' ', manager.emp_last_name) AS Manager FROM employee LEFT JOIN emp_role ON employee.emp_role_id=emp_role.ro_id   LEFT JOIN department on  department.dp_id=emp_role.ro_dp_id LEFT JOIN employee Manager ON  Manager.emp_id = employee.emp_manager_id;", function (err, result, fields) {
            if (err) throw err;
            console.table(result);
            Select_options();
        });
    });
}
//  Add_Departmentsto_System 
function Add_Departments() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "name",
                message: "Enter new Department?",
            },
        ])
        .then((data) => {
            const { name } = data;
            connection.query(
                `INSERT INTO department (dp_name) VALUES (?)`,
                [name],
                (err, res) => {
                    if (err) throw err;
                    console.log(
                        ` Department ${name} has been Added!`
                    );
                    View_All_Departments();
                }

            );
            //Select_options() ;
        });

}

function Add_EmployeeRoll() {

    connection.query("SELECT department.dp_name FROM department", (err, data) => {
        const departments = data.map((item) => `${item.dp_name}`);
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Enter the Title of the New Role",
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Enter the Salary of the New Role",
                },
                {
                    type: "list",
                    name: "department_name",
                    message: "Select the Department of New Role",

                    choices: [...departments],

                },
            ])
            .then((data) => {
                const { title, salary, department_name } = data;
                connection.query(
                    `INSERT INTO emp_role (ro_title, ro_salary, ro_dp_id)
                   SELECT ?, ?, department.dp_id
                   FROM department
                   WHERE department.dp_name = ?`,
                    [title, salary, department_name],
                    (err, res) => {
                        if (err) throw err;
                        console.log(
                            ` Role ${title}  Added!`
                        );
                        View_All_EmployeeRoll();

                    }
                );
            });
        //Select_options();
    });


}


//Add_Employee_to_System
function Add_Employee() {
    let userInput1;
    const query = `SELECT ro_id, ro_title FROM emp_role`;
    Promise.resolve()
        .then(() => {
            return new Promise((resolve, reject) => {
                connection.query(query, (err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
        })
        .then((rolesData) => {
            const roles = rolesData.map(
                (item) => ` ${item.ro_title}, ID: ${item.ro_id}`
            );
            return inquirer.prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "Enter the employee's first name",
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "Enter the employee's last name",
                },
                {
                    name: "role",
                    type: "list",
                    message: "Select the employee's role",
                    choices: roles,
                },
            ]);
        })
        .then((answer) => {
            Fitst_answers = answer;
            const query2 = `SELECT CONCAT( emp_first_name,' ' ,emp_last_name) As name, emp_id FROM employee JOIN emp_role ON employee.emp_role_id=emp_role.ro_id WHERE emp_role.ro_title LIKE '%Chief%' OR emp_role.ro_title LIKE '%Manager%'  ; `;
            return new Promise((resolve, reject) => {
                connection.query(query2, (err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
        })
        .then((managersData) => {
            const managers = managersData.map(
                (item) => `${item.name} ID:${item.emp_id}`
            );
            return inquirer.prompt([
                {
                    name: "manager",
                    type: "list",
                    message: "Select The Manager Employee Report",
                    choices: [...managers, "None"],
                },
            ]);
        })
        .then((answer) => {
            const query = `INSERT INTO employee(emp_first_name, emp_last_name, emp_role_id, emp_manager_id) VALUES (?,?,?,?)`;
            connection.query(
                query,
                [
                    Fitst_answers.first_name,
                    Fitst_answers.last_name,
                    Fitst_answers.role.split("ID: ")[1],
                    answer.manager.split("ID:")[1],
                ],
                (err, data) => {
                    if (err) throw err;
                    console.log(
                        `Employee ${Fitst_answers.first_name} ${Fitst_answers.last_name} Successfully added to the Database`
                    );
                    View_All_Employee();
                }
            );
        });
}
//Update_Employee_Role_in_System
function Update_Employee_Role() {
    const query = `SELECT emp_first_name, emp_last_name FROM employee;`;
    connection.query(query, (err, data) => {
        const employees = data.map(
            (item) => `${item.emp_first_name} ${item.emp_last_name}`
        );
        inquirer
            .prompt([
                {
                    name: "employee",
                    type: "list",
                    message: "Select Employee you wish to Update",
                    choices: employees,
                },
            ])
            .then((answer) => {
                const selectedEmployee = answer.employee.split(" ");
                const firstName = selectedEmployee[0];
                const lastName = selectedEmployee[1];
                const query = `SELECT ro_title FROM emp_role;`;
                connection.query(query, (err, data) => {
                    const roles = data.map((item) => item.ro_title);
                    inquirer
                        .prompt({
                            name: "role",
                            type: "list",
                            message: "Select Employee's New Role",
                            choices: roles,
                        })
                        .then((answer) => {
                            const query = `SELECT ro_id FROM emp_role WHERE ro_title = ?`;
                            connection.query(query, [answer.role], (err, data) => {
                                if (err) throw err;
                                const roleId = data[0].ro_id;
                                const query = `UPDATE employee SET emp_role_id = ? WHERE emp_first_name = ? AND emp_last_name = ?`;
                                connection.query(
                                    query,
                                    [roleId, firstName, lastName],
                                    (err, data) => {
                                        if (err) throw err;
                                        console.log(
                                            `Successfully Updated ${firstName} ${lastName}'s Role to ${answer.role}.`
                                        );
                                        View_All_Employee();
                                    }
                                );
                            });
                        });
                });
            });
    });
}
//View_Employees_by_Department_
function View_Employees_by_Department() {
    connection.query("SELECT department.dp_name FROM department", (err, data) => {
        const departments = data.map((item) => `${item.dp_name}`);
        inquirer
            .prompt([

                {
                    type: "list",
                    name: "department_name",
                    message: "Select the Department of New Role",

                    choices: [...departments],

                },
            ])
            .then((data) => {
                const { department_name } = data;
                const Selevt_department = department_name;
                connection.connect(function (err) {
                    if (err) throw err;
                    var Ptint_query = connection.query("SELECT employee.emp_id AS 'First id', employee.emp_first_name AS 'First Name', employee.emp_last_name AS 'Last Name', emp_role.ro_title AS 'Employee Roll',department.dp_name AS 'Employee Department',emp_role.ro_salary AS 'Employee Salary' , CONCAT(manager.emp_first_name, ' ', manager.emp_last_name) AS Manager FROM employee LEFT JOIN emp_role ON employee.emp_role_id=emp_role.ro_id   LEFT JOIN department on  department.dp_id=emp_role.ro_dp_id LEFT JOIN employee Manager ON  Manager.emp_id = employee.emp_manager_id where department.dp_name=" + "'" + "" + department_name + "" + "'" + " ;", function (err, result, fields) {
                        if (err) throw err;
                        console.table(result);
                        //console.log(Ptint_query.sql);
                        Select_options();
                    });
                });
            });
        //Select_options();
    });

}
//View_Employees_by_Manager
function View_Employees_by_Manager() {
    connection.query("SELECT CONCAT(employee.emp_first_name, ' ',employee.emp_last_name) AS Manager , emp_role.ro_title AS 'EmployeeRoll',department.dp_name AS 'EmployeeDepartment'FROM employee LEFT JOIN emp_role ON employee.emp_role_id=emp_role.ro_id   LEFT JOIN department on  department.dp_id=emp_role.ro_dp_id LEFT JOIN employee Manager ON  Manager.emp_id = employee.emp_manager_id  WHERE ro_title LIKE '%Manager%' ;", (err, data) => {
        const Roll = data.map((item) => `${item.Manager}`);
        inquirer
            .prompt([

                {
                    type: "list",
                    name: "Manager",
                    message: "Select the Manager Name",

                    choices: [...Roll],

                },
            ])
            .then((data) => {
                const { Manager } = data;

                connection.connect(function (err) {
                    if (err) throw err;
                    var Ptint_query = connection.query("SELECT * FROM(SELECT employee.emp_id AS 'First id', employee.emp_first_name AS 'First Name', employee.emp_last_name AS 'Last Name', emp_role.ro_title AS 'Employee Roll',department.dp_name AS 'Employee Department',emp_role.ro_salary AS 'Employee Salary' , CONCAT(manager.emp_first_name, ' ', manager.emp_last_name) AS Manager FROM employee LEFT JOIN emp_role ON employee.emp_role_id=emp_role.ro_id   LEFT JOIN department on  department.dp_id=emp_role.ro_dp_id LEFT JOIN employee Manager ON Manager.emp_id = employee.emp_manager_id)as innerTable WHERE Manager=" + "'" + "" + Manager + "" + "'" + " ;", function (err, result, fields) {
                        if (err) throw err;
                        console.table(result);
                        //   console.log(Ptint_query.sql);
                        Select_options();
                    });
                });
            });
        //Select_options();
    });

}

//View_the_total_Utilized_Budget_of_a_Department
function View_the_total_Utilized_Budget_of_a_Department() {
    connection.query("SELECT department.dp_name FROM department", (err, data) => {
        const departments = data.map((item) => `${item.dp_name}`);
        inquirer
            .prompt([

                {
                    type: "list",
                    name: "department_name",
                    message: "Select the Department of New Role",

                    choices: [...departments],

                },
            ])
            .then((data) => {
                const { department_name } = data;
                const Selevt_department = department_name;
                connection.connect(function (err) {
                    if (err) throw err;
                    var Ptint_query = connection.query(" SELECT department.dp_name AS 'Department',SUM(emp_role.ro_salary) AS 'Utilized Budget' FROM employee LEFT JOIN emp_role ON employee.emp_role_id=emp_role.ro_id LEFT JOIN department on department.dp_id=emp_role.ro_dp_id LEFT JOIN employee Manager ON Manager.emp_id = employee.emp_manager_id where department.dp_name=" + "'" + "" + department_name + "" + "'" + " ;", function (err, result, fields) {
                        if (err) throw err;
                        console.table(result);
                        //console.log(Ptint_query.sql);
                        Select_options();
                    });
                });
            });
        //Select_options();
    });
}

//Delete_Departments_from_System
function Delete_Departments() {
    connection.query("SELECT department.dp_name FROM department", (err, data) => {
        const departments = data.map((item) => `${item.dp_name}`);
        inquirer
            .prompt([

                {
                    type: "list",
                    name: "department_name",
                    message: "Select the Department of New Role",

                    choices: [...departments],

                },
            ])
            .then((data) => {
                const { department_name } = data;

                connection.connect(function (err) {
                    if (err) throw err;
                    var Ptint_query = connection.query("DELETE FROM department WHERE dp_name=" + "'" + "" + department_name + "" + "'" + " ;", function (err, result, fields) {
                        if (err) throw err;
                        console.log("Department" + " " + department_name + " " + "Delete from Database");
                        //console.log(Ptint_query.sql);
                        View_All_Departments();
                        Select_options();
                    });
                });
            });
        //Select_options();
    });
}
//Delete_Roles_from_System
function Delete_Roles() {
    connection.query("SELECT ro_title FROM emp_role", (err, data) => {
        const departments = data.map((item) => `${item.ro_title}`);
        inquirer
            .prompt([

                {
                    type: "list",
                    name: "ro_title",
                    message: "Select the Department of New Role",

                    choices: [...departments],

                },
            ])
            .then((data) => {
                const { ro_title } = data;

                connection.connect(function (err) {
                    if (err) throw err;
                    var Ptint_query = connection.query("DELETE FROM emp_role WHERE ro_title=" + "'" + "" + ro_title + "" + "'" + " ;", function (err, result, fields) {
                        if (err) throw err;
                        console.log("Employee Roll" + " " + ro_title + " " + "Delete from Database");
                        //console.log(Ptint_query.sql);
                        View_All_EmployeeRoll();
                        Select_options();
                    });
                });
            });
        //Select_options();
    });

}
//Delete_Employees_from_System
function Delete_Employees() {
    connection.query("SELECT CONCAT( employee.emp_first_name ,' ', employee.emp_last_name )AS 'Employee_Name' FROM employee", (err, data) => {
        const departments = data.map((item) => `${item.Employee_Name}`);
        inquirer
            .prompt([

                {
                    type: "list",
                    name: "Employee_Name",
                    message: "Select Employee You need to Delete",

                    choices: [...departments],

                },
            ])
            .then((data) => {
                const { Employee_Name } = data;
                //const EmpId=null;
                connection.query("SELECT * FROM(SELECT emp_id, CONCAT( employee.emp_first_name ,' ', employee.emp_last_name )AS 'Employee_Name' FROM employee) as innerTable WHERE Employee_Name=" + "'" + "" + Employee_Name + "" + "'" + " ;", (err, data) => {
                    const EmpId = data.map((item) => `${item.emp_id}`);
               //console.log(data);
               // console.log(EmpId);
                    //EmpId  = data.map((item) => `${item.emp_id}`);
                  
                    //console.log();
               
                   connection.connect(function (err) {
                    if (err) throw err;
                    //SELECT * FROM(SELECT emp_id, CONCAT( employee.emp_first_name ,' ', employee.emp_last_name )AS 'Employee_Name' FROM employee) as innerTable WHERE Employee_Name='Tony Normen';

                    var Ptint_query = connection.query("DELETE FROM employee WHERE emp_id=" + "'" + "" + EmpId + "" + "'" + " ;", function (err, result, fields) {
                        if (err) throw err;
                        console.log("Employee Roll" + " " + Employee_Name + " " + "Delete from Database");
                        //console.log(Ptint_query.sql);
                        View_All_Employee();
                       // Select_options();
                    });
                });
                });
            });
        //Select_options();
    });
}
const artStr = String.raw`
  
????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????

?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                                        
`; console.log(artStr);
Select_options();

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
////////////////////////////////////////////////////////////////////////////////////////////////////


function Select_options() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'SelectOptions',
            message: 'What Would you like to do?',
            choices: ['Add Departments', 'Add Role', 'Add Employee', 'View All Deparment', 'View All Role', 'View All Employee', 'View Employees by Manager', 'View Employees by Department', 'View the total Utilized Budget of a Department', 'Update Employee Role', 'Update Employee Managers ', 'Delete Departments', 'Delete Roles', 'Delete Employees','Quit']
        }
    ])
        .then((answer) => {
            switch (answer.SelectOptions) {
                case "Add Departments":
                    Add_Departments();

                    break;

                case "Add Role":
                    Add_EmployeeRoll();
                    break;

                case "Add Employee":
                    //Add_Employee();
                    Add_Employee();
                    break;

                case "View All Deparment":
                    View_All_Departments();

                    break;

                case "View All Role":
                    View_All_EmployeeRoll();

                    break;

                case "View All Employee":
                    View_All_Employee();

                    break;

                case "Update Employee Role":
                    Update_Employee_Role();
                    break;

                case "View Employees by Department":
                    View_Employees_by_Department();
                    break;

                case "View Employees by Manager":
                    View_Employees_by_Manager();
                    break;

                case "View the total Utilized Budget of a Department":
                    View_the_total_Utilized_Budget_of_a_Department();
                    break;

                case "Delete Departments":
                    Delete_Departments();
                    break;
                case "Delete Roles":
                    Delete_Roles();
                    break;
                case "Delete Employees":
                    Delete_Employees();
                    break;
                    case "Quit":
                        process.exit();
                        break;
                    

            }
        })
};

