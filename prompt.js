const cTable = require('console.table');
const db = require('./db/connection');
const inquirer = require('inquirer');

// QUERIES ========== ========== ========== ========= ==========
function queryAllEmployees() {
	return db
		.promise()
		.query(
			`SELECT
                employeesTableA.id AS id,
                employeesTableA.first_name AS first_name,
                employeesTableA.last_name AS last_name,
                roles.title AS title,
                departments.name AS department,
                roles.salary AS salary,
                CONCAT_WS(' ', employeesTableB.first_name, employeesTableB.last_name) AS manager
               FROM employees AS employeesTableA
               JOIN roles
               ON employeesTableA.role_id = roles.id
               JOIN departments
               ON roles.department_id = departments.id
               LEFT JOIN employees AS employeesTableB
               ON (employeesTableA.manager_id = employeesTableB.id)`
		)
		.then((response) => {
			result = cTable.getTable(response[0]);
			return result;
		});
}

function queryRolesList() {
	return db
		.promise()
		.query(`SELECT * FROM roles`)
		.then((response) => {
			array = response[0].map((element) => element.title);
			return array;
		});
}

function queryEmployeesList() {
	return db
		.promise()
		.query(`SELECT * FROM employees`)
		.then((response) => {
			array = response[0].map((element) => `${element.first_name} ${element.last_name}`);
			return array;
		});
}

function queryAllRoles() {
	return db
		.promise()
		.query(
			`SELECT roles.id AS role_id, roles.title AS role_title, roles.salary AS role_salary, departments.name AS department_name
               FROM roles
               JOIN departments
               ON roles.department_id = departments.id`
		)
		.then((response) => {
			result = cTable.getTable(response[0]);
			return result;
		});
}

function queryDepartmentsList() {
	return db
		.promise()
		.query(`SELECT * FROM departments`)
		.then((response) => {
			array = response[0].map((element) => element.name);
			return array;
		});
}

function queryAllDepartments() {
	return db
		.promise()
		.query(`SELECT * FROM departments`)
		.then((response) => {
			result = cTable.getTable(response[0]);
			return result;
		});
}

// ASYNC FUNCTIONS ========== ========== ========== ========= ==========
// * converted
async function handleViewAllEmployees() {
	console.log(`handleViewAllEmployees`);
	table = await queryAllEmployees();
	console.log(table);
}

// * converted
// TODO - add POST
async function handleAddEmployee() {
	console.log(`handleAddEmployee`);
	let roles = [];
	let managers = [];

	roles = await queryRolesList();
	managers = await queryEmployeesList();

	inquirer
		.prompt([
			{
				type: 'input',
				name: 'firstName',
				message: `What is the employee's first name?`,
			},
			{
				type: 'input',
				name: 'lastName',
				message: `What is the employee's last name?`,
			},
			{
				type: 'list',
				name: 'employeeRole',
				message: `What is the employee's role?`,
				choices: roles,
			},
			{
				type: 'list',
				name: 'employeeManager',
				message: `Who is the employee's manager?`,
				choices: managers,
			},
		])
		.then((answer) => console.log(answer))
		.then(() => chooseTask());
}

// TODO convert
// TODO add POST
handleUpdateEmployeeRole = () => {
	console.log(`handleUpdateEmployeeRole`);
};

// * converted
async function handleViewAllRoles() {
	console.log('handleViewAllRoles');
	table = await queryAllRoles();
	console.log(table);
}

function postRole(title, salary, department_id) {
  const sql = `INSERT INTO roles (title, salary, department_id)
               VALUES (?, ?, ?)`;
	const params = [title, salary, department_id];
  db.query(sql, params)
}

// * converted
// TODO add POST
async function handleAddRole() {
	console.log(`handleAddRole`);
	let departments = [];

	departments = await queryDepartmentsList();

	inquirer
		.prompt([
			{
				type: 'input',
				name: 'title',
				message: 'What is the name of the new role?',
			},
			{
				type: 'input',
				name: 'salary',
				message: 'What is the salary for the new role?',
			},
			{
				type: 'list',
				name: 'department',
				message: 'What department does the role belong to?',
				choices: departments,
			},
		])
		.then((answer) => {
      console.log(`title >>>`, answer.title);
      console.log(`salary >>>`, answer.salary);
      console.log(`department >>>`, answer.department);
      console.log(departments)
      const index = departments.findIndex((element) => element === answer.department)
      department_id = index + 1
      console.log(`department index `, index)
      console.log(`department_id = `, department_id)
      postRole(answer.title, answer.salary, department_id);
    })
		.then(() => chooseTask());
}

// * converted
async function handleViewAllDepartments() {
	console.log(`handleViewAllDepartments`);
	table = await queryAllDepartments();
  console.log(table)
}

// TODO convert
async function handleAddDepartment() {
	console.log(`handleAddDepartment`);
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'department',
				message: 'What is the name of the new department?',
			},
		])
		.then((answer) => {
			console.log(answer.department);
			const sql = `INSERT INTO departments (name)
               VALUES (?)`;
			const params = [answer.department];

			db.query(sql, params, (err, result) => {
				if (err) {
					return err;
				}
				console.log(`${answer.department} added`);
			});
		})
		.then(() => chooseTask());
}

// ROUTER ========== ========== ========== ========== ==========
routeTask = (answer) => {
	console.log(`Answer was:`, answer);
	switch (answer) {
		case 'View All Employees':
			handleViewAllEmployees().then(() => chooseTask());
			break;
		case 'Add Employee':
			handleAddEmployee();
			break;
		case 'Update Employee Role':
			handleUpdateEmployeeRole();
			break;
		case 'View All Roles':
			handleViewAllRoles().then(() => chooseTask());
			break;
		case 'Add Role':
			handleAddRole();
			break;
		case 'View All Departments':
			handleViewAllDepartments().then(() => chooseTask());
			break;
		case 'Add Department':
			handleAddDepartment();
			break;
		case 'Quit':
			break;
	}
};

chooseTask = () => {
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'tasks',
				message: 'What would you like to do?',
				choices: [
					'View All Employees',
					'Add Employee',
					'Update Employee Role',
					'View All Roles',
					'Add Role',
					'View All Departments',
					'Add Department',
					'Quit',
				],
			},
		])
		.then((answer) => routeTask(answer.tasks));
};

chooseTask();
