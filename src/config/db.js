const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connectDB = async () => {

    return mongoose.connect(process.env.DB_URL);
};


module.exports = connectDB;