const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const cTable = require('console.table');

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
		const table = cTable.getTable(rows);
		console.log(table);
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

// Add a department
router.post('/departments', ({ body }, res) => {
	const sql = `INSERT INTO departments (name)
               VALUES (?)`;
	const params = [body.name];

	db.query(sql, params, (err, result) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		res.json({
			message: 'department added',
			data: body,
		});
	});
});

// Add a role
router.post('/roles', ({ body }, res) => {
	const sql = `INSERT INTO roles (title, salary, department_id)
               VALUES (?, ?, ?)`;
	const params = [body.title, body.salary, body.department_id];

	db.query(sql, params, (err, result) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		res.json({
			message: 'role added',
			data: body,
		});
	});
});

// Add and employee
router.post('/employees', ({ body }, res) => {
	const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
               VALUES (?, ?, ?, ?)`;
	const params = [body.first_name, body.last_name, body.role_id, body.manager_id];

	db.query(sql, params, (err, result) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		res.json({
			message: 'employee added',
			data: body,
		});
	});
});

// Update an employee role
router.put('/employees/:id', (req, res) => {
	const sql = `UPDATE employees
               SET role_id = ?
               WHERE id = ?`;
	const params = [req.body.role_id, req.params.id];
	db.query(sql, params, (err, result) => {
		if (err) {
			res.status(400).json({ error: err.message });
		} else if (!result.affectedRows) {
			res.json({ message: 'Employee not found' });
		} else {
			res.json({
				message: 'employee updated',
				data: req.body,
				changes: result.affectedRows,
			});
		}
	});
});

module.exports = router;
