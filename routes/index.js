var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();

var categories_controller = require('../controller/categoriesController')
var items_controller = require('../controller/itemController')

router.get('/', categories_controller.categories_list); 

router.get('/categories/create', categories_controller.category_create_get);
router.post('/categories/create', categories_controller.category_create_post);
router.get('/categories/:id', categories_controller.category_detail);

router.get('/categories/:id/delete', categories_controller.category_delete_get);
router.post('/categories/:id/delete', categories_controller.category_delete_post);

router.get('/categories/:id/update', categories_controller.category_update_get);
router.post('/categories/:id/update', categories_controller.category_update_post);




router.get('/item/:id', items_controller.item_detail);
router.get('/item/:id/delete', items_controller.item_delete);

router.get('/categories/:id/addItem', items_controller.category_addItem_get);
router.post('/categories/:id/addItem', items_controller.category_addItem_post);

/* GET home page. */
// router.get('/', function(req, res) {
//   //res.redirect('/catalog');
//   res.send("welcome to index");
// });
// router.get('/', function(req, res) {
//   res.redirect('/catalog');
//   //res.send("welcome to index");
// });

module.exports = router;
