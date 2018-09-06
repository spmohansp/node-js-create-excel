const express = require('express');
const app = express();
// app.set('port', process.env.PORT || 3000);//port initialization
app.listen(3000);
app.set('view engine', 'ejs');   //ejs files
app.use(express.static('public'));      //create public folder
//Body Praser 
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// DB CONNECTIONS
const mongoose = require('mongoose');
const mongooseConnection = require('./db/mongooseConnection');
// FOR EXCEL FILE
var mongoXlsx = require('mongo-xlsx');
var fs = require('fs');
// PDF MAKER
var pdf = require('html-pdf');
// DOWNLOAD FILES FROM URL TO LOCAL SERVER
var download = require('download-file')

const { excels } = require('./model/excel');

// CREATE EXCE FILE
app.get('/', (req, res) => {
    var options =  {
        save: false,
        sheetName: [],
        fileName: "spmohansp-" + new Date().getTime() + ".xlsx",
        path: "./public/",
        defaultSheetName: "spmohansp"
    }
    var finalData=[];
    
    for (let index = 0; index < 100; index++) {
        var data={};
        data.name='name'+index;
        data.address='salem'+index;
        data.mobile='123456789'+index;
        finalData.push(data);
    }
//    res.send(finalData);
//    var data = [ { name : "mohan", lastName : "s", address : 'salem' } , { name : "ragu",  lastName : "r", address :"salem",mobile:'1234567890' }];
//    res.send(data);
    var model = mongoXlsx.buildDynamicModel(finalData);
    mongoXlsx.mongoData2Xlsx(finalData, model,options, function(err, finalData) {
        var FilePath = 'public/'+finalData.fileName;
        // donload excel file
        res.download(FilePath,'mohan.xlsx');
        setTimeout(function() {
            fs.unlink(FilePath,function(err){
                if(err) return console.log(err);
                console.log(finalData.fileName + ' file was deleted successfully');
            })
        }, 1000);
    });
});


// READ EXCEL FILES
app.get('/read',(req,res)=>{
    var model = null;
    var filePath="./public/spmohansp-1536211913011.xlsx";
    mongoXlsx.xlsx2MongoData(filePath, model, function(err, mongoData) {
            mongoData.forEach(element => {
                var productData = new excels(element);
                productData.save().then((data) => {
                    // console.log("inserted");
                })
            });
        res.send(mongoData); 
    });
});

// FOR PDF FILES
app.get('/pdf',(req,res)=>{
    var html = '<p>Hello User Welcome ! Have A Nice Day</p>';
    var options = { format: 'Letter' };
    var fileName="spmohansp-" + new Date().getTime() + ".pdf";
    var filePath="./public/"+fileName;
    pdf.create(html, options).toFile(filePath, function(err, finalData) {
        if (err) return console.log(finalData);
        var FilePathDownload = 'public/'+fileName;
        res.download(FilePathDownload,'mohan.pdf');
        // DELETE FILE
        setTimeout(function() {
            fs.unlink(FilePathDownload,function(err){
                if(err) return console.log(err);
                console.log(FilePathDownload + ' file was deleted successfully');
            })
        }, 1000);
    });
})
