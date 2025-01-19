const express = require('express');
const { auth } = require('express-openid-connect');
const dotenv = require('dotenv');
const { client } = require('./db');
const cors = require('cors');
const app = express();
dotenv.config();

const PORT = 3100;

const corsOptions = {
    origin: ["http://localhost:3000"],
};

const config = {
    authRequired: false,
    auth0Logout: true,
    baseURL: 'http://localhost:3000',
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_URL,
    secret: process.env.AUTH0_SECRET,
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/jobs', require('./routes/jobs'))
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));

// db setup
const db = client.db('skillSharing');
const collection = db.collection('users');

app.get('/', (req, res) => {
    console.log('GET / route accessed');
    if (req.oidc.isAuthenticated()) {
        const email = req.oidc.user.email;
        console.log(`Authenticated user email: ${email}`);
        collection.find({ email }).toArray().then((result) => {
            console.log('Database query result:', result);
            if (result.length === 0) {
                collection.insertOne({ email }).then(() => {
                    console.log('New user inserted in DB');
                    res.redirect('http://localhost:3000/uploadResume');
                }).catch((err) => {
                    console.error('Error inserting user:', err);
                    res.send(err);
                });
            } else {
                res.redirect('http://localhost:3000/uploadResume');
            }
        });
    } else {
        console.log('User not authenticated');
        res.send('Hello, please log in');
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});