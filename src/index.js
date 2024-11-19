const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

app.use(express.static('public'));

// Define a route that renders a view
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

const port = 1104;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});