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
   res.sendFile( __dirname + "/" + "index.html" );
})


// ===================== CREATE NEW QUOTE ====================

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
    res.redirect('/')
})

//=================  GET ALL QUOTES =============

app.get('/all_quotes' , function(req , res){
  Quote.find({}, function(err, quotes) {
     if (err) throw err;
     res.end(JSON.stringify(quotes));
   });
})


//=============== UPDATE QUOTE ===================

app.post('/update', urlencodedParser, function (req, res) {

  var updateQuote = {
     author:req.body.author,
     quote:req.body.quote ,
     rating : req.body.rating
  };
  var quote_id = mongoose.Types.ObjectId(req.body.id);
          Quote.findByIdAndUpdate( quote_id , updateQuote ,  function(err , quote){
                if(err){
                      throw err  ;
                }
                console.log('Quote updated successfully!');
          });
          res.redirect('/')
})
//================== DELETE QUOTE ====================

app.post('/delete' , urlencodedParser ,  function( req , res){

        var quote_id = mongoose.Types.ObjectId(req.body.id);
        Quote.findById(quote_id , function(err , quote){
                  if(err) throw err ;

                  quote.remove(function(err){
                      if ( err) {
                          throw err;
                      }
                      console.log('Quote deleted successfully!');
                  })
        });
        res.redirect('/')
});
//============ SERVER EVENT LISTENER ====================

var server = app.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
