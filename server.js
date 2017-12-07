var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var mongoose = require('mongoose');

var Quote = require('./models/quote');

var mongoDB = 'mongodb://njabulo:1996@ds044577.mlab.com:44577/codespace';
mongoose.connect(mongoDB, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.static('public'));
app.use(express.static(__dirname + '/css'));

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "quote_form.html" );
})

app.post('/quote', urlencodedParser, function (req, res) {

  var newQuote = new Quote({
     author:req.body.author,
     quote:req.body.quote ,
     rating : req.body.rating
  });
  console.log(newQuote);
  res.end(JSON.stringify(newQuote));

    newQuote.save(function(err) {
    if (err) throw err;

    console.log('Quote saved successfully!');
});
})
app.get('/view_quotes' , function(req , res){
        res.sendFile(__dirname + '/' + 'view_quotes.html');
})
app.get('/all_quotes' , function(req , res){
  Quote.find({}, function(err, quotes) {
     if (err) throw err;

  // object of all the users

     res.end(JSON.stringify(quotes));
   });
})
app.post('/update_quote', urlencodedParser, function (req, res) {

      var newQuote = new Quote({
          author:req.body.author,
          quote:req.body.quote ,
          rating : req.body.rating
      });
      console.log(newQuote);
      var id = req.body._id;
      console.log(id);
      res.end(JSON.stringify(newQuote));

      newQuote.save(function(err) {
      if (err) throw err;
            console.log('Quote updated successfully!');
    });
})
var server = app.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
