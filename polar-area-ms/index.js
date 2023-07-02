const express = require('express');
const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 9004;
const host = process.env.HOST || 'localhost';

const local_URI = `http://${host}:${port}`;


app.use('/public', express.static('public'));
app.use('/', require('./routes/routes'));



app.listen(port, () => {
    console.log(`Polar-area-ms running on ${local_URI}`);
})
