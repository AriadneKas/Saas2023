const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = process.env.PORT || 9001;
const host = process.env.HOST || 'localhost';
const dbHost = process.env.DB_HOST || '127.0.0.1'
const dbPort = process.env.DB_PORT || 27018;

const local_URI = `http://${host}:${port}`;
const db_URI = `mongodb://${dbHost}:${dbPort}/userDB`;


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(db_URI,  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('connected', () => {
  console.log('Connected to MongoDB');
});

db.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

app.use('/user-api', require('./routes/routes'))
app.use('/admin', require('./routes/admin'))


app.listen(port, () => {

    console.log("User microservice is running on", local_URI);
});