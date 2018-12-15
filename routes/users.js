var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController'); 

router.get('/create', user_controller.create_get);
router.post('/create', user_controller.create_post);
router.get('/:id/delete', user_controller.delete_get);
router.post('/:id/delete', user_controller.delete_post);
router.get('/:id/update', user_controller.update_get);
router.post('/:id/update', user_controller.update_post);
router.get('/:id', user_controller.detail);
router.get('/', user_controller.list);

module.exports = router;
