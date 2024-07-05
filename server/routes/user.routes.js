const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');
const userCtrl = require('../controllers/user.controller');

router.route('/api/users')
    .get(userCtrl.list)
    .post(userCtrl.create);

router.route('/api/users/:userId')
    .get(authCtrl.requireSignin ,userCtrl.read)
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization ,userCtrl.update)
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization ,userCtrl.remove);

router.param('userId', userCtrl.userById);

module.exports = router;