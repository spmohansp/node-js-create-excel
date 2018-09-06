const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/tiruchengode',{ useNewUrlParser: true });
mongoose.Promise = global.Promise;
module.export = {mongoose};