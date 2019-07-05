const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const crypto = require('crypto');
const express = require('express');
const flash = require('connect-flash');
const helmet = require('helmet');
const knex = require('knex');
const session = require('express-session');
const { check, validationResult, body } = require('express-validator');

const DEFAULT_PORT = 8080;
const DEFAULT_BASE_URL = `http://localhost:${DEFAULT_PORT}`;

// Setup database connection
const db = knex(process.env.ENV === 'development' ? {
  client: 'sqlite3',
  connection: {
    filename: './db.sqlite',
  },
  useNullAsDefault: true,
} : {
  client: 'pg',
  connection: process.env.DATABASE_URL,
});

// SQL schema table setup
db.schema.hasTable('entries').then(exists => {
  if (!exists) {
    return db.schema.createTable('entries', t => {
      t.increments('id').primary();
      t.timestamps();
      t.string('token', 255);
      t.string('name', 255);
      t.string('email', 255);
    });
  }
});

// Create and configure express HTTP server instance
const app = express();

const port = process.env.PORT || DEFAULT_PORT;

app.set('view engine', 'pug');
app.set('x-powered-by', false);

// Initialize session storage
const KnexSessionStore = require('connect-session-knex')(session);

app.use(session({
  store: new KnexSessionStore({
    knex: db,
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
app.get('/', (req, res) => {
  res.render('home');
});

app.use((req, res, next) => {
  res.render('404');
});

// Start HTTP server
app.listen(port, () => console.log(`HTTP server listening on port ${port}!`));
