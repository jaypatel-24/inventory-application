const { body,validationResult } = require('express-validator');

var Item = require('../models/items');
var async = require('async'); 
var Categories = require('../models/categories')



// Display list of all Categories.
exports.categories_list = function(req, res, next) {
  
    Categories.find()
      .sort([['name', 'ascending']])
      .exec(function (err, list_categories) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('categories_list', { title: 'Category List', categories_list: list_categories });
      });
  
  };

  //create category on GET
  exports.category_create_get = function(req, res, next) {
    res.render('category_form', { title: 'Create Category'});
};

// Handle Category create on POST.
exports.category_create_post = [

  // Validate and sanitise fields.
  body('name', 'name must be specified').trim().isLength({ min: 1 }).escape(),
  body('description', 'description must be specified').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a BookInstance object with escaped and trimmed data.
      var category = new Categories(
        { 
            name: req.body.name,
            description: req.body.description
         });

      if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values and error messages.
          Categories.find({},'name')
              .exec(function (err) {
                  if (err) { return next(err); }
                  // Successful, so render.
                  res.render('category_form', { title: 'Create Category', errors: errors.array() });
          });
          return;
      }
      else {
          // Data from form is valid.
          category.save(function (err) {
              if (err) { return next(err); }
                 // Successful - redirect to new record.
                 res.redirect(category.url);
              });
      }
  }
];

  exports.category_detail = function(req, res, next) {
    async.parallel(
        {
          category: function (callback) {
            Categories.findById(req.params.id).exec(callback);
          },
    
          category_items: function (callback) {
            Item.find({ category: req.params.id }).exec(callback);
          },
        }, 
        function (err, results) {
            if (err) { return next(err); }
            if (results.category == null) {
              // No results.
              const err = new Error("category not found");
              err.status = 404;
              return next(err);
            }
            res.render("category_detail", { title: "Category Detail", category: results.category, category_items: results.category_items });
        }
      );
};


exports.category_delete_get = function(req,res,next) {
    
    async.parallel(
        {
          category: function (callback) {
            Categories.findById(req.params.id).exec(callback);
          },
    
          category_items: function (callback) {
            Item.find({ category: req.params.id }).exec(callback);
          },
        }, 
        function (err, results) {
            if (err) { return next(err); }
            if (results.category == null) {
              // No results.
              const err = new Error("category not found");
              err.status = 404;
              return next(err);
            }
            res.render("category_delete", { title: "Category Delete", category: results.category, category_items: results.category_items });
        }
      );
}

exports.category_delete_post = function(req,res,next) {
  Categories.findByIdAndRemove(req.params.id, function(err) {
    if(err) {return next(err); }
    res.redirect('/');
  })
}


//update category on GET
exports.category_update_get = function(req, res, next) {
  res.render('category_form', { title: 'Update Category', createForm : false});
};

exports.category_update_post = function(req, res, next) {
    const { id } = req.params;
    const { name, description } = req.body;

    
    // Extract the validation errors from a request.
    const errors = validationResult(req);
  
    // Create a Category object with escaped/trimmed data and old id.
    const category = new Categories({
      name,
      description,
      _id: id, //This is required, or a new ID will be assigned!
    });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Update category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if category with same name already exists.
      Categories.findOne({ name }).exec(function (err, found_category) {
        if (err) {
          return next(err);
        }
  
        if (found_category) {
          // category exists, redirect to its detail page.
          res.redirect(found_category.url);
        } else {
          Categories.findByIdAndUpdate(id, category, {},function (err, category) {
              if (err) {  return next(err);  }
              // Successful - redirect to category detail page.
              res.redirect(category.url);
            }
          );
        }
      });
    }
  };