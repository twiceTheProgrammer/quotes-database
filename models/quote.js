var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quoteSchema = new Schema({
  author: String,
  quote:String ,
  rating : Number 
});
var Quote = mongoose.model('Quote', quoteSchema);

// make this available to our users in our Node applications
module.exports = Quote;
