#! /usr/bin/env node

console.log('This script populates some test items and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Categories = require('./models/categories')
var Items = require('./models/items')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = []
var items = []


function categoryCreate(name, desc, cb) {
  categorydetail = {name: name , description: desc }
  
  var category = new Categories(categorydetail);
       
  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category)
  }  );
}


function itemCreate(category, description,name, price, quantity, cb) {
  itemdetail = { 
    category: category,
    description: description,
    name: name,
    price: price,
    quantity: quantity
    
  }
    
  var item = new Items(itemdetail);    
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}



function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate(categories[0], "Table is used for studies, keeping different stuff on it","Table", "100", "5", callback)
        },
        function(callback) {
            itemCreate(categories[1],  "For patients these are used for taking them different ward","streacher", "500", "15",  callback)
          }
        ],
        // Optional callback
        cb);
}

function createCategories(cb) {
  async.parallel([
      function(callback) {
        categoryCreate("category1", "this is category 1", callback);
      },
      function(callback) {
          categoryCreate("category2", "this is category 2",callback);
        }
      ],
      // optional callback
      cb);
}



async.series([
    createCategories,
    createItems
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    
    // All done, disconnect from database
    mongoose.connection.close();
});



