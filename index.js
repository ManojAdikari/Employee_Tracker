
const inquirer = require("inquirer");
const fs = require("fs");
const Data_Server = require("./lib/Manager");


function Select_options() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'SelectOptions',
            message: 'What Would you like to do?',
            choices: ['Add Departments', 'Add Role', 'Add Employee', 'View All Deparment', 'View All Role', 'View All Employee', 'Update Employee Role']
        }
    ])
        .then((answer) => {
            switch (answer.SelectOptions) {
                case "Add Departments":
                    
                    inquirer.prompt(Add_Departments)
                        .then((engineerAnswers) => {
                            const engineer = new Engineer(engineerAnswers.name, engineerAnswers.id, engineerAnswers.email, engineerAnswers.github);
                            employee.push(engineer);
                            Team_Members();
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                    break;
                case "Add Role":
                    inquirer.prompt(Add_Role)
                        .then((engineerAnswers) => {
                            const engineer = new Engineer(engineerAnswers.name, engineerAnswers.id, engineerAnswers.email, engineerAnswers.github);
                            employee.push(engineer);
                            Team_Members();
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                    break;
                case "Add Employee":
                    inquirer.prompt(Add_Employee)
                        .then((engineerAnswers) => {
                            const engineer = new Engineer(engineerAnswers.name, engineerAnswers.id, engineerAnswers.email, engineerAnswers.github);
                            employee.push(engineer);
                            Team_Members();
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                    break;
                case "View All Deparment":
                    inquirer.prompt(View_All_Deparment)
                        .then((engineerAnswers) => {
                            const engineer = new Engineer(engineerAnswers.name, engineerAnswers.id, engineerAnswers.email, engineerAnswers.github);
                            employee.push(engineer);
                            Team_Members();
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                    break;
                case "View All Role":
                    inquirer.prompt(View_All_Role)
                        .then((internAnswers) => {
                            const intern = new Intern(internAnswers.name, internAnswers.id, internAnswers.email, internAnswers.school);
                            employee.push(intern);
                            Team_Members();
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                    break;
                    case "View All Employee":
                        inquirer.prompt(View_All_Employee)
                            .then((internAnswers) => {
                                const intern = new Intern(internAnswers.name, internAnswers.id, internAnswers.email, internAnswers.school);
                                employee.push(intern);
                                Team_Members();
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                        break;
                case "Update Employee Role":
                    inquirer.prompt(Update_Employee_Role)
                    .then((internAnswers) => {
                        const intern = new Intern(internAnswers.name, internAnswers.id, internAnswers.email, internAnswers.school);
                        employee.push(intern);
                        Team_Members();
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        })
};

const Add_Departments = [
    {
        type: 'input',
        message: 'Enter Department Name',
        name: 'name',
        validate: (nameInput) => {
            if (nameInput) {
                return true;
            } else {
                console.log("Please Enter  Name!");
                return false;
            }
        }
    },
 
   
    
];

const Add_Role = [
    {
        type: 'input',
        message: 'Enter Employee Role',
        name: 'Role',
        validate: (nameInput) => {
            if (nameInput) {
                return true;
            } else {
                console.log("Please Enter Employee Role!");
                return false;
            }
        }
    },
 
    {
        type: 'input',
        message: 'Please Enter Role Salary',
        name: 'Salary',
        validate: (nameInput) => {
            if (nameInput) {
                return true;
            } else {
                console.log("Please Enter  Role Salary!");
                return false;
            }
        }
    },
    {
        type: 'list',
        message: 'Please Select department',
        name: 'department',
        choices:['uu','oo'],
        validate: (nameInput) => {
            if (nameInput) {
                return true;
            } else {
                console.log("Please Select department!");
                return false;
            }
        }
    },
    
];
const Add_Employee = [
    {
        type: 'input',
        message: 'Enter Employee First Name',
        name: 'Firstname',
        validate: (nameInput) => {
            if (nameInput) {
                return true;
            } else {
                console.log("Enter Employee First Name!");
                return false;
            }
        }
    },
 
    {
        type: 'input',
        message: 'Enter Employee Last Name',
        name: 'Lastname',
        validate: (nameInput) => {
            if (nameInput) {
                return true;
            } else {
                console.log("Enter Employee Last Name!");
                return false;
            }
        }
    },
    {
        type: 'list',
        message: 'Please Select Employee Role',
        name: 'Role',
        choices:['uu','oo'],
        validate: (nameInput) => {
            if (nameInput) {
                return true;
            } else {
                console.log("Please Select Employee Role");
                return false;
            }
        }
    },
    {
        type: 'list',
        message: 'Please Select Manager',
        name: 'Manager',
        choices:['uu','oo'],
        validate: (nameInput) => {
            if (nameInput) {
                return true;
            } else {
                console.log("Please Select Manager!");
                return false;
            }
        }
    },
    
];
const View_All_Deparment = [
    {
        type: 'input',
        message: 'Enter Department Name',
        name: 'name',
        validate: (nameInput) => {
            if (nameInput) {
                return true;
            } else {
                console.log("Please Enter  Name!");
                return false;
            }
        }
    },
 
   
    
];
const View_All_Role = [
    {
        
    },
 
   
    
];
const View_All_Employee = [
    {
        type: 'input',
        message: 'Enter Department Name',
        name: 'name',
        validate: (nameInput) => {
            if (nameInput) {
                return true;
            } else {
                console.log("Please Enter  Name!");
                return false;
            }
        }
    },
 
   
    
];
const Update_Employee_Role = [
    {
        type: 'input',
        message: 'Enter Department Name',
        name: 'name',
        validate: (nameInput) => {
            if (nameInput) {
                return true;
            } else {
                console.log("Please Enter  Name!");
                return false;
            }
        }
    },
 
   
    
];










const artStr = String.raw`
  
███████╗███╗░░░███╗██████╗░██╗░░░░░░█████╗░██╗░░░██╗███████╗███████╗
██╔════╝████╗░████║██╔══██╗██║░░░░░██╔══██╗╚██╗░██╔╝██╔════╝██╔════╝
█████╗░░██╔████╔██║██████╔╝██║░░░░░██║░░██║░╚████╔╝░█████╗░░█████╗░░
██╔══╝░░██║╚██╔╝██║██╔═══╝░██║░░░░░██║░░██║░░╚██╔╝░░██╔══╝░░██╔══╝░░
███████╗██║░╚═╝░██║██║░░░░░███████╗╚█████╔╝░░░██║░░░███████╗███████╗
╚══════╝╚═╝░░░░░╚═╝╚═╝░░░░░╚══════╝░╚════╝░░░░╚═╝░░░╚══════╝╚══════╝

░░░███╗░░░███╗░█████╗░███╗░░██╗░█████╗░░██████╗░███████╗██████╗░░░░
░░░████╗░████║██╔══██╗████╗░██║██╔══██╗██╔════╝░██╔════╝██╔══██╗░░░
░░░██╔████╔██║███████║██╔██╗██║███████║██║░░██╗░█████╗░░██████╔╝░░░
░░░██║╚██╔╝██║██╔══██║██║╚████║██╔══██║██║░░╚██╗██╔══╝░░██╔══██╗░░░
██╗██║░╚═╝░██║██║░░██║██║░╚███║██║░░██║╚██████╔╝███████╗██║░░██║██╗
╚═╝╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═╝░░╚═╝░╚═════╝░╚══════╝╚═╝░░╚═╝╚═╝
                                        
`; console.log(artStr);

Select_options();
