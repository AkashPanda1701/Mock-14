const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT;
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');
const User = require('./models/user.model');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');


app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

app.get('/', async (req, res) => {
    const users = await User.find();
    return res.status(200).send({users});
});


// Signup

app.post('/signup', async (req, res) => {
    const {email, password} = req.body;
    try {
        const isExist = await User.findOne({email});
        if(isExist) {
            return res.status(400).send({
                message : 'User already exist Please login'
            });
        }
        const hashPassword = await argon2.hash(password);
        const user = await User.create({
            email,
            password : hashPassword
        });
        return res.status(201).send({
            message : 'User created successfully',
        });

        
    } catch (error) {
        
        return res.status(400).send({
            message : 'Something went wrong',
            error : error.message
        });
    }
});

// Login

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).send({
                message : 'User not found Please signup'
            });
        }
        const isPasswordValid = await argon2.verify(user.password, password);

        if(!isPasswordValid) {
            return res.status(400).send({
                message : 'Invalid Credentials'
            });
        }
        const token = jwt.sign({userId : user._id,
        email : user.email
        }, process.env.JWT_SECRET, {expiresIn : '7days'});
        
        
        return res.status(200).send({
            message : 'Login Successful',
            token
        });
    } catch (error) {
        return res.status(400).send({
            message : 'Something went wrong',
            error : error.message
        });
    }
});




app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server http://localhost:${PORT} `);
});


