require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const movies = require('./movies-data-small');

const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

const handleAuth = (req, res, next) => {
    // verifies auth token
}

const searchByTerm = (store, searchType, searchTerm) => {
    // handles search type and uses term to return filtered array
}

const searchByVote = (store, avgVote) => {
    // handles search # and uses number to return filtered array
}

const curateResponse = (req, res) => {
    res.send('Hellooooo, Express!');
}

app.get('/movie', curateResponse);

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
});

