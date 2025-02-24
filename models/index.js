const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.projects = require("./projects.model.js")(mongoose);
db.submittals = require("./submittals.model.js")(mongoose);

module.exports = db;