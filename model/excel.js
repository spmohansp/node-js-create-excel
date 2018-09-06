var mongoose = require('mongoose');
var catagorySchema = new mongoose.Schema({
    name:{
        type:String,
    },
    address:{
        type:String,
    },
    mobile:{
        type:String,
    },
});

var excels = mongoose.model('excel', catagorySchema );
module.exports = {excels}