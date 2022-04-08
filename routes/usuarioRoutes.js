//Controllers

const usuarioController = require ('../controller/usuarioController');

//Importamos express

const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const passport = require ('passport');

//Tambien es necesario start el metodo ROUTER de express
// Con este método tranformamos app en router. El mismo router es como una app de express.

const router = express.Router();

//.add para añadir projectos que vienen del formulario de Angular

//Metodo Post
/**
 * *Register new user
 */
router.post('/login/register',usuarioController.login_register );

/**
 * * Autheticate users
 */

router.post('/login/autheticate',usuarioController.login_authenticate);
//exportamos este documento para imporatarlo en index.js


router.get ('/profile',passport.authenticate("jwt",{session: false }),(req,res)=>{

    res.send("You have access total.")
});

module.exports = router;