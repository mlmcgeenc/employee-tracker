const express = require('express');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use apiRoutes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
	res.json({
		message: 'Server is running',
	});
});

// Default response foe any other request (Not Found)
app.use((req, res) => {
	res.status(404).end();
});

db.connect((err) => {
	if (err) throw err;
	console.log('Database connected.');
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
});