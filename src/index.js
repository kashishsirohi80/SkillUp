const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const collection = require('./config')

const app = express();

// convert data into json format 
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// Set the view engine to EJS
app.set('view engine', 'ejs');

app.use(express.static('public'));

// Define a route that renders a view
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard', { username: 'omsh888' });
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

// register user
app.post('/signup', async (req, res) => {
    const user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    try {
        // Check if the user already exists in the database
        const existingUser = await collection.findOne({
            $or: [
                { username: user.username },
                { email: user.email }
            ]
        });
        if (existingUser) {
            return res.status(400).send('Username or Email already exists.');
        }

        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;

        // Save user to the database
        const newUser = await collection.create(user);
        console.log("New User Registered Successfully...");
        console.log("New User Details:- \n", user);
        console.log(`${user.username} logged in successfully ...\n`);
        
        return res.status(201).send(`${user.username} logged in successfully ...\n`);

        // Redirect to home after signup
        // res.status(201).redirect('/home');

    } catch (error) {
        console.error('Error during user registration:', error);
        return res.status(500).send('Internal Server Error during user registration...');
    }
});

// login user
app.post('/login', async (req, res) => {
    const user = {
        usernameoremail: req.body.usernameoremail,
        password: req.body.password
    };
    try {
        const existingUser = await collection.findOne({
            $or: [
                { username: user.usernameoremail },
                { email: user.usernameoremail }
            ]
        });

        if (!existingUser) {
            return res.status(400).send("Invalid Username Or Email ...");
        }

        const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid Password ...');
        }

        console.log(`${existingUser.username} logged in successfully ...\n`);

        return res.status(201).send(`${existingUser.username} logged in successfully ...\n`);

        // Redirect to home after login
        // res.status(201).redirect('/home');

    } catch (error) {
        console.error('Error during user login:', error);
        return res.status(500).send('Internal Server Error during user login ...');
    }
});

const port = 1104;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});