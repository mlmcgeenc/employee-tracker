const cTable = require('console.table');
const db = require('./db/connection');
const inquirer = require('inquirer');

function queryAllEmployees() {
	return db
		.promise()
		.query(`SELECT
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
               ON (employeesTableA.manager_id = employeesTableB.id)`)
		.then((response) => {
			result = cTable.getTable(response[0])
			return result;
		});
}

async function handleViewAllEmployees() {
	console.log(`handleViewAllEmployees`);
  table = await queryAllEmployees()
  console.log(table)
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

handleUpdateEmployeeRole = () => {
	console.log(`handleUpdateEmployeeRole`);
};

async function handleViewAllRoles() {
	console.log(`handleViewAllRoles`);
	const sql = `SELECT roles.id AS role_id, roles.title AS role_title, roles.salary AS role_salary, departments.name AS department_name
               FROM roles
               JOIN departments
               ON roles.department_id = departments.id`;
	db.query(sql, (err, rows) => {
		if (err) {
			console.log(err);
			return;
		}
		const table = cTable.getTable(rows);
		console.log(`\n ${table} \n`);
		return table;
	});
}

async function handleAddRole() {
	console.log(`handleAddRole`);
	let choicesArray = [];
	db.query(`SELECT * FROM departments`, (err, rows, fields) => {
		const response = { rows };
		choicesArray = response.rows.map((element) => element.name);

		inquirer
			.prompt([
				{
					type: 'input',
					name: 'roleName',
					message: 'What is the name of the new role?',
				},
				{
					type: 'input',
					name: 'roleSalary',
					message: 'What is the salary for the new role?',
				},
				{
					type: 'list',
					name: 'roleDepartment',
					message: 'What department does the role belong to?',
					choices: choicesArray,
				},
			])
			.then((answer) => console.log(answer))
			.then(() => chooseTask());
	});
	return;
}

async function handleViewAllDepartments() {
	console.log(`handleViewAllDepartments`);
	const sql = `SELECT * FROM departments`;
	db.query(sql, (err, rows) => {
		if (err) {
			console.log(err.message);
			return;
		}
		const table = cTable.getTable(rows);
		console.log('\n', table);
		return table;
	});
}

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
