require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hellooooo, Express!');
});

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
});

