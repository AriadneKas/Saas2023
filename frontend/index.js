const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fs = require('fs');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));
app.use('/admin', require('./routes/admin'));
app.use('/login', require('./routes/googleSSO'));
app.use('/', require('./routes/pages'));
app.use('/api', require('./routes/api'));



app.use((req, res) => {
    res.status(404).render('error', { error: '404 - Resource not found :\'(' })
})


// Start the server
app.listen(80, () => {
    console.log('Server running on HTTP');
});
