const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const flash = require('connect-flash');
const helmet = require('helmet');

const DEFAULT_PORT = 8080;
const DEFAULT_BASE_URL = `http://localhost:${DEFAULT_PORT}`;

// Create and configure express HTTP server instance
const app = express();

const port = process.env.PORT || DEFAULT_PORT;

app.set('view engine', 'pug');
app.set('x-powered-by', false);

// Use flash middleware
app.use(flash());

// Enable compression and parsing form requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());

// Setup CORS
app.use(cors({
  methods: 'GET,POST',
  origin: process.env.BASE_URL || '*',
}));

app.use(helmet());

// Serve assets folder
app.use(express.static('static'));

// Define routes
app.get('/', (req, res) => {
  res.render('home');
});

app.use((req, res, next) => {
  res.render('404');
});

// Start HTTP server
app.listen(port, () => console.log(`HTTP server listening on port ${port}!`));
