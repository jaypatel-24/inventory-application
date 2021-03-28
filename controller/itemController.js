const { body,validationResult } = require('express-validator');

var Item = require('../models/items');
var async = require('async'); 
var Categories = require('../models/categories')

exports.item_detail = function(req,res,next) {

    Item.findById(req.params.id)
    .exec(function (err, item) {
      if (err) { return next(err); }
      if (item==null) { // No results.
          var err = new Error('Book copy not found');
          err.status = 404;
          return next(err);
        }
      // Successful, so render.
      res.render('item_detail', { item: item} );
    })

}

exports.item_delete = function(req,res,next) {
    Item.findByIdAndRemove(req.params.id, function(err) {
        if(err) {return next(err); }
        res.redirect('/');
    })
}


//add new item GET
exports.category_addItem_get = function(req,res,next) {
  res.render('add_new_item', {title : 'Add new item'});
}

//add new item POST
exports.category_addItem_post = function(req,res,next) {

  // Extract the validation errors from a request.
  const errors = validationResult(req);

  var item = new Item(
    { 
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity
     });

  if (!errors.isEmpty()) {
    // There are errors. Render form again with sanitized values/error messages.

    // Get all categories for form.
    Categories.find().exec(function (err, categories) {
      if (err) {
        return next(err);
      }
      res.render("add_new_item", { title: "Create Item",  errors: errors.array(), });
    });
    return;
  } else {
    
    // Data from form is valid. Save item.
    item.save(function (err) {
      if (err) {
        return next(err);
      }
      //successful - redirect to new item record.
      res.redirect(item.url);
    });
  }
};
