const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');


router.route('/auth/signin')
    .get(authCtrl.signIn);

router.route('/auth/signout')
    .get(authCtrl.signOut);

module.exports = router;