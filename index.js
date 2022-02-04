const {prompt} = require('inquirer');
const cTable = require('console.table');
const connection = require('./config/connection');


const questions = [
    {
        type:'list',
        name:'action',
        message: 'What would you like to do?',
        choices:[
            'View All Employees',
            'View All Roles',
            'View All Departments',
            'Add New Employee',
            'Add New Role',
            'Add New Department',
            'Update Employee Role',
            'Remove Employee',
            'Finihsed']
}];

const init = () => {
    prompt(questions)
        .then((answers) => {
            switch (answers.action){
                case 'View All Employees':
                    searchEmp();
                    break;
                
                case 'View All Roles':
                    searchRole();
                    break;

                case 'View All Departments':
                    searchDept();
                    break;
                
                case 'Add New Employee':
                    addEmp();
                    break;
                
                case 'Add New Role':
                    addRole();
                    break;
                
                case 'Add New Department':
                    addDept();
                    break;
                
                case 'Update Employee Role':
                    updateEmpRole();
                    break;
                
                case 'Remove Employee':
                    deleteEmp();
                    break;
                
                case 'Finished':
                    connection.end();
                    break;
                
            }
    });
}

const queryEmps = 'SELECT * FROM employees;';
const queryRoles = 'SELECT * FROM roles;';
const queryDepts = 'SELECT * FROM departments;';

const queryEmpsInfo = 'SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.dept FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.dept_id = departments.id;';
const queryRolesInfo = 'SELECT roles.id, roles.title, roles.salary, departments.dept FROM roles LEFT JOIN departments ON roles.dept_id = departments.id;';

const queryEmpsBasic = 'SELECT id, first_name, last_name FROM employees;';
const queryRoleManagers = 'SELECT id, FROM roles;';

const queryEmpChoices = 'SELECT CONCAT(employees.first_name, " ", employees.last_name) AS empName FROM employees;';

const queryAddEmp = 'INSERT INTO employees SET ?;';
const queryAddRole = 'INSERT INTO roles SET ?;';
const queryAddDept = 'INSERT INTO departments SET ?;';

const queryUpdateEmp = 'UPDATE employees SET ? WHERE ?;';
const queryUpdateRole = 'UPDATE roles SET ? WHERE ?;';
const queryDeleteEmp = 'DELETE FROM  employees WHERE ?;';

const searchEmp = () =>{
    connection.query(queryEmpsInfo, (err, res) =>{
        if (err) throw err;
        console.log(`\n\n\n
        *** Viewing all ${res.length} Employees *** \n`);
        console.table(res);
    });
    init();
};

const searchRole = () =>{
    connection.query(queryRolesInfo, (err, res) =>{
        if (err) throw err;
        console.log(`\n\n\n
        *** Viewing all ${res.length} Roles *** \n`);
        console.table(res);
    });
    init();
};

const searchDept = () =>{
    connection.query(queryDepts, (err, res) =>{
        if (err) throw err;
        console.log(`\n\n\n
        *** Viewing all Departments *** \n`);
        console.table(res);
    });
    init();
};

const addEmp = () => {

    connection.query(queryRoles, (err, res) => {
        let roleChoices = res.map(function (res){
            return res['title'];
        });
        let roles = res;
        connection.query('SELECT employees.first_name, employees.last_name, employees.role_id, roles.title FROM employees INNER JOIN roles ON employees.role_id = roles.id WHERE employees.is_mangr=TRUE;'), (err, res) => {
            let managerChoices = res.map(function(res){
                return { name: res.first_name + ' ' + res.last_name + ":" + res.title,value: res.role_id};
            });

            prompt([
                {
                type:'input',
                name:'newEmpFirst',
                message:'\n New employee`s first name?'
                },
                {type:'input',
                name:'newEmpLast',
                message:'New employee`s last name?'
                },
                {
                    type:'list',
                    name:'newEmpRole',
                    message:'New employee`s role?',
                    choices: roleChoices
                },
                {
                    type:'list',
                    name:'newRoleManager',
                    message: 'Employee`s manager?',
                    choices: managerChoices
                }
            ]).then ((answers) => {
                
                let empRole = roles.find(role => role.title === answers.newEmpRole);

                let empRoleManager = roles.find( role => role.id === answers.newRoleManager );
                connection.query('INSERT INTO employees SET ?', {
                    id: empRole.id,
                    first_name: answers.newEmpFirst,
                    last_name: answers.newEmpLast,
                    mangr_id: answers.empRoleManager,
                    role_id: empRole.id
                }, (err, res) => {
                    if (err) throw err;

                    console.log(('\n\n\n *** New Employee Added! *** \n'));
                    searchEmp();
                });
            });
        }
    });
};

const addRole = () => {
    connection.query(queryDepts, (err, res) => {
        let deptChoices = res.map(function (res) {
            return res ['dept'];
        });

        prompt([
            {
                type:'input',
                name: 'newRoleTitle',
                message:'Name of New Role?'
            },
            {
                type:'input',
                name:'newRoleSalary',
                message: 'Salary of New Role?'
            },
            {
                type:'list',
                name:'newRoleDept',
                message:'Which department is this New Role under?',
                choices: deptChoices
            }
        ]).then ((answers) => {
            connection.query(queryDepts, (err, res) => {
                if (err) throw err;
                const departments = res.find(departments => departments.dept === answers.newRoleDept);
                connection.query(queryAddRole,
                    {
                        title: answers.newRoleTitle,
                        salary: answers.newRoleSalary,
                        dept_id: departments.id
                    },(err, res) => {
                        if (err) throw err;
                        console.table(res);
                        console.log('\n\n\n *** New Role Added! ***\n')


                        searchRole();
                    });
            });
        });
    });
};

const addDept = () => {
    prompt([
        {
            type:'input',
            name:'newDept',
            message:'Name of New Department?'
        }
    ]).then ((answers)=> {
        connection.query(queryAddDept,
            {
                dept: answers.newDept
            }, (err, res) => {
                if (err) throw err;
                console.table(res);
                console.log('*** New Department successfully added! ***');

                searchDept();
            });
    });
};

const updateEmpRole = () => {
    connection.query(queryEmpChoices, (err, res) => {
        let empChoices = res.map(function (res) {
            return res['empName'];
            console.log(empChoices);
        });
        connection.query('SELECT roles.title FROM roles', (err, res) => {
            let roleChoices = res.map(function (res) {
                return res['title'];
                console.log(roleChoices);
            });

            prompt([
                {
                    type:'list',
                    name:'updateEmp',
                    message:'Which employee would you like to update?',
                    choices: empChoices
                },
                {
                    type:'list',
                    name:'updateRole',
                    message:'Employee`s new role?',
                    choices: roleChoices
                }
            ]).then((answers) => {
                connection.query(queryRoles, (err, res) => {
                    if (err) throw err;
                    let roles = res;
                    let updatedRoles = roles.find(role => role.title === answers.updateRole);
                    console.log(updatedRoles);

                        connection.query(queryEmps, (err, res) => {
                            if (err) throw err;
                            let fullName = answers.updateEmp.split(' ');
                            const updatedEmp = res.find(employees => employees.first_name + " " + employees.last_name === answers.updateEmp);
                            console.log(updatedEmp);
                            connection.query(queryUpdateEmp,
                                [
                                    {
                                        role_id: updatedRole.id
                                    },
                                    {
                                        id: updatedEmp.id,
                                    }
                                ], (err, res) => {
                                    if (err) throw err;
                                    console.log(err);
                                    console.log('\n\n\n*** Employee Role successfully updated! ***\n')

                                    searchEmp();
                                }
                            );
                        });
                });
            });
        });
    });
};

const deleteEmp = () => {
    connection.query(queryEmpChoices, (err, res) => {
        let empChoices = res.map(function (res) {
            return res['empName'];
        });

        prompt([
            {
                type:'list',
                name:'deleteEmp',
                message:'Which employee would you like to remove?',
                choices: empChoices
            }
        ]).then((answers) => {
            connection.query(queryEmpsBasic, (err, res) => {
                if (err) throw err;
                let fullName = answers.deleteEmp.split(' ');
                const employees = res.find(employees => employees.first_name === fullName[0] && employees.last_name === fullName[1]);
                connection.query(queryDeleteEmp,
                    {
                        id: employees.id
                    },
                    (err, res) => {
                        if (err) throw err;

                        console.log('\n\n\n*** Employee has been removed ***\n')

                        searchEmp();
                    });
            });
        });
    });
};

init();