const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const flash = require('connect-flash');
const helmet = require('helmet');
const session = require('express-session');

const DEFAULT_PORT = 8080;

// Create and configure express HTTP server instance
const app = express();

const port = process.env.PORT || DEFAULT_PORT;

app.set('view engine', 'pug');
app.set('views', 'server/views');
app.set('x-powered-by', false);

// Initialize session storage
const KnexSessionStore = require('connect-session-knex')(session);

app.use(session({
  store: new KnexSessionStore({
    knex: require('./db'),
  }),
  resave: false,
  saveUninitialized: false,
  secret: process.env.SECRET || 'secret',
  cookie: {
    maxAge: 60000,
    secure: process.env.ENV === 'production',
  },
}));

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
app.use('/', require('./routes'));

// Start HTTP server
app.listen(port, () => console.log(`HTTP server listening on port ${port}!`));
