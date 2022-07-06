const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const cTable = require('console.table')

// View all departments
router.get('/departments', (req, res) => {
	const sql = `SELECT * FROM departments`;
	db.query(sql, (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		res.json({
			message: 'succes',
			data: rows,
		});
    const table = cTable.getTable(rows)
    console.log(table)
	});
});

// View all roles
router.get('/roles', (req, res) => {
	const sql = `SELECT roles.id AS role_id, roles.title AS role_title, roles.salary AS role_salary, departments.name AS department_name
               FROM roles
               JOIN departments
               ON roles.department_id = departments.id`;
	db.query(sql, (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		res.json({
			message: 'succes',
			data: rows,
		});
    const table = cTable.getTable(rows);
		console.log(table);
	});
});

// View all employees
router.get('/employees', (req, res) => {
	const sql = `SELECT
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
               ON (employeesTableA.manager_id = employeesTableB.id)`;
	db.query(sql, (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		res.json({
			message: 'succes',
			data: rows,
		});
    const table = cTable.getTable(rows);
		console.log(table);
	});
});

module.exports = router