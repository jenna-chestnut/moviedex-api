require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const movies = require('./movies-data-small');

const handleAuth = (req, res, next) => {
  // verifies auth token
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({
      error: 'Unauthorized Request'
    });
  }

  next();
};

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';

const app = express();
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());
app.use(handleAuth);

const searchByTerm = (store, searchType, searchTerm) => {
  // handles search type and uses term to return filtered array
  searchTerm = searchTerm.toLowerCase();

  const filtered = store
    .filter(mov => {
      const type = mov[searchType].toLowerCase();
      return type.includes(searchTerm);
    });

  return filtered;
};

const searchByVote = (store, avgVote) => {
  // handles search # and uses number to return filtered array
  const filtered = store
    .filter(mov => mov.avg_vote >= avgVote);

  return filtered;
};

const curateResponse = (req, res, err) => {
  // start with the whole dang store
  let response = movies;

  // deconstruct queries
  const { genre, country, avg_vote } = req.query;

  //does genre query exist? if so, run a search, otherwise do nothing
  if (genre) response = searchByTerm(response, 'genre', genre);

  //does country query exist? if so, run a search, otherwise do nothing
  if (country) response = searchByTerm(response, 'country', country);

  //does avg vote query exist? if so, attempt to run a search, otherwise do nothing
  const vote = parseInt(avg_vote);
  if (avg_vote) {
    // only run a search if number is valid - throw error otherwise
    if (!Number.isNaN(vote)) {
      response = searchByVote(response, vote);
    } else {
      err('Average vote must be a number!');
      return;
    }
  }

  //if nothing matches a search, send a message instead of empty array
  if (response.length === 0) {
    response = 'Sorry! No results found, please try again.';
  }

  res.status(200).json(response);
};

app.get('/movie', curateResponse);

app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }};
  } else {
    response = { error };
  }
  res.status(500).json(response);
});
  

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
});