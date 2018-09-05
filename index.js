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

// FOR EXCEL FILE
var mongoXlsx = require('mongo-xlsx');
// PDF
var pdf = require('html-pdf');

// CREATE EXCE FILE
app.get('/', (req, res) => {
    var options =  {
        save: false,
        sheetName: [],
        fileName: "spmohansp-" + new Date().getTime() + ".xlsx",
        path: "./public/",
        defaultSheetName: "spmohansp"
    }
    var data={};
    var datas=[];
   for (let index = 0; index < 100; index++) {
    // data.date=new Date();
    data.name='name'+index;
    data.address='salem'+index;
    data.mobile='123456789'+index;
    datas.push(data);
   }
   finalData = datas;
//    res.send(datas);
//    var data = [ { name : "mohan", lastName : "s", address : 'salem' } , { name : "ragu",  lastName : "r", address :"salem",mobile:'98745633210' }];
//    res.send(data);
    var model = mongoXlsx.buildDynamicModel(finalData);
    mongoXlsx.mongoData2Xlsx(finalData, model,options, function(err, finalData) {
        res.send('File Saved In the path: '+finalData.fullPath); 
    });
});


// READ EXCEL FILES
app.get('/read',(req,res)=>{
    var model = null;
    var filePath="./public/spmohansp-1536130725019.xlsx";
    mongoXlsx.xlsx2MongoData(filePath, model, function(err, mongoData) {
        mongoData.forEach(element => {
            // console.log(element);
        });
        res.send(mongoData); 
    });
});

// FOR PDF FILES
app.get('/pdf',(req,res)=>{
    var html = '<p>Hello User Welcome ! Have A Nice Day</p>';
    var options = { format: 'Letter' };
    var filePath="./public/spmohansp-" + new Date().getTime() + ".pdf";
    pdf.create(html, options).toFile(filePath, function(err, finalData) {
        if (err) return console.log(finalData);
        res.send(finalData); // { filename: '/app/businesscard.pdf' }
    });
})
