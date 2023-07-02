const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

const port = process.env.PORT || 9003;
const host = process.env.HOST || 'localhost';
const dbHost = process.env.DB_HOST || '127.0.0.1'
const dbPort = process.env.DB_PORT || 27018;

const local_URI = `http://${host}:${port}`;
const db_URI = `mongodb://${dbHost}:${dbPort}/chartDB`;


mongoose.connect(db_URI).then(() => {
    console.log("DB connected");
}).catch(err => 
    {
        console.log(err);
        console.log("There's no point in keeping the service on without its DB");
        process.exit(1);
    });

app.use('/', require('./routes/create'));
app.use('/', require('./routes/dashboard'));
app.use('/admin', require('./routes/admin'));

app.listen(port, () =>{
    console.log("DB microservice is running on " + local_URI);
});

