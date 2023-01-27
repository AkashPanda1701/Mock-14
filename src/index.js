const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT;
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');
const User = require('./models/user.model');
var randomWords = require('random-words');

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

app.get('/', async (req, res) => {
    const users = await User.find();
    return res.status(200).send({users});
});


// Signup on the server

app.post('/signup', async (req, res) => {
    const {name} = req.body;
    try {
        const isExist = await User.findOne({name});
        if(isExist) {
            return res.status(200).send({
                message : 'Welcome start playing',
                user: isExist
            });
        }
        const user = await User.create({
            name,
            score :0
        });
        return res.status(200).send({
            message : 'Welcome start playing',
            user
        });

        
    } catch (error) {
        
        return res.status(400).send({
            message : 'Something went wrong',
            error : error.message
        });
    }
});







app.get('/random', async (req, res) => {
    
    try {
       const [randomWord] = randomWords({ min: 3, max: 10 });
       console.log('randomWord: ', randomWord);

         return res.status(200).send({
            randomWord
        });
        } catch (error) {
        return res.status(400).send({
            message : 'Something went wrong',
            error : error.message
        });
         
        }

    
});

//verify user send the correct word

app.post('/verify', async (req, res) => {
    const {id, userword,randomWord} = req.body;
    try {
        if(userword === randomWord){

            //update score of user with the length of the word

            const user = await User.findByIdAndUpdate(id, {
                $inc : {score : randomWord.length}
            }, {new : true});
            return res.status(200).send({
                message : 'Correct word',
                score : user.score
            });
        }else{
             //reduce score of user with the length of the word

             const user = await User.findByIdAndUpdate(id, {
                $inc : {score : -randomWord.length}
            }, {new : true});

            return res.status(200).send({
                message : 'Wrong word',
                score : user.score
            });
        }
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


