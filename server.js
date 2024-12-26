// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB Atlas Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS_URI);
        console.log('MongoDB Atlas connected successfully...\n');
    } catch (error) {
        console.error('Error while connecting to MongoDB Atlas:', error);
        process.exit(1);
    }
};
connectDB();

// mongoose
//     .connect(process.env.MONGODB_ATLAS_URI)
//     .then(() => {
//         console.log('MongoDB Compass connected successfully...\n');
//     })
//     .catch((error) => {
//         console.error('Error connecting to MongoDB compass:', error);
//     });

// Create a Schema
const loginschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a Model
const collection = mongoose.model("logincredentials", loginschema);

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.render('homePage');
});

app.get('/homePage', (req, res) => {
    res.render('homePage');
});

app.get('/dashboard', (req, res) => {
    const loggedinuser = 'omsh117';
    res.render('dashboard', { loggedinuser });
});

app.get('/games', (req, res) => {
    const loggedinuser = 'omsh117';
    res.render('games', { loggedinuser });
});

app.get('/about', (req, res) => {
    const loggedinuser = 'omsh117';
    res.render('about', { loggedinuser });
});

app.get('/contact', (req, res) => {
    const loggedinuser = 'omsh117';
    res.render('contact', { loggedinuser });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

// Register User
app.post('/signup', async (req, res) => {
    const user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    try {
        // Check if the user already exists
        const existingUser = await collection.findOne({
            $or: [
                { username: user.username },
                { email: user.email }
            ]
        });

        if (existingUser) {
            return res.status(400).send('Username or Email already exists.');
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;

        // Save the user
        const newUser = await collection.create(user);
        console.log("New User Registered Successfully...");
        console.log("New User Details:\n", user);
        console.log(`${user.username} logged in successfully ...\n`);

        // return res.status(201).send(`${user.username} registered successfully.`);
        const loggedinuser = user.username;
        return res.render('dashboard', { loggedinuser });
    } catch (error) {
        console.error('Error during user registration:', error);
        return res.status(500).send('Internal Server Error during user registration.');
    }
});

// Login User
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
            return res.status(400).send("Invalid Username or Email.");
        }

        const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid Password.');
        }

        console.log(`${existingUser.username} logged in successfully ...\n`);
        const loggedinuser = existingUser.username;

        // return res.status(200).send(`${existingUser.username} logged in successfully.`);
        return res.render('dashboard', { loggedinuser });

        // Redirect to home after login
        // res.status(201).redirect('/home');

    } catch (error) {
        console.error('Error during user login:', error);
        return res.status(500).send('Internal Server Error during user login.');
    }
});

// Start the Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});