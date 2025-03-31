const express = require('express');
const bodyParser = require('body-parser');
const cors = require ('cors');

const app = express();

var corsOptions = {
    origin: 'http://localhost:3000'
};

app.use(cors());

// parse requests of content-type - applicaton/json
app.use(bodyParser.json());


// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the thing.' });
});

// const submittalsController = require('./controllers/submittal.controller.js');

// app.get('/testdir', (req, res) => {
//         fs.mkdir(path.join(__dirname, '/test'), {}, (err) => {
//             if (err) throw err;
//             console.log('folder created ...');
//         });
//         res.json({ message: 'Test directory created.' });
// });

const submittalsRoute = require('./routes/submittals.routes.js');
const projectsRoute = require('./routes/projects.routes.js');
const serverRoute = require('./routes/server.routes.js');

app.use('/api/submittals', submittalsRoute);
app.use('/api/projects', projectsRoute);
app.use('/api/server', serverRoute);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

const db = require('./models');
// db.mongoose.set('useNewUrlParser', true);
// db.mongoose.set('useFindAndModify', false);
// db.mongoose.set('useCreateIndex', true);
// db.mongoose.set('useUnifiedTopology', true);

db.mongoose
    .connect(db.url)
    .then(() => {
        console.log('Connected to the database!');
    })
    .catch(err => {
        console.log('Cannot connect to the database!', err);
        process.exit();
    });