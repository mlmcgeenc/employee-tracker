import inquirer from 'inquirer';

inquirer
	.prompt([
		{
			type: 'list',
			name: 'tasks',
			message: 'What would you like to do?',
			choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department'],
		},
	])
	.then((answers) => console.log(answers));

module.exports = inquiry