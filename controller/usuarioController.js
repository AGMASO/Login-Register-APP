
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../config/auth');
require("dotenv").config();


/**
 * !Creamos las funciones
 */

/**
 * * Function login_register
 */

const login_register = async(req,res)=>{

    try{
        const name = req.body.name;
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        /**
         * * validate the data from form
         */
        if(!email || !name || !username || !password){
            console.log(name);
            return res.status(400).json({message: "Not all fields have been entered"});
            
        }

        /**
         * *Checking that password has more than 5 characters
         */
        if(password.length < 5){
            return res.status(400).json({message: "The password need to be at least 5 characters long."});
        }
        /**
         * *Check password vs passwordCheck
         */
        /*if(password !== passwordCheck){
            return res.status(400).json({message: "Password do not match. Please try again"});
        }*/
        /**
         * *Checking that email is unique in database
         */

        const existingEmail = await Usuario.findOne({email : email});
        if(existingEmail){
            return res.status(400).json({message:"This email already exists"});
        }

        /**
         * *Using Bcrypt to hash password to database
         */
        
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        /**
         * ! Creamos nuevo objeto Usuario pero en password le damos valor passwordHash para guardar asi en DDBB
         */

        const newUsuario = new Usuario({

            name: name,
            username: username,
            email:email,
            password: passwordHash,
        });
        

        const savedUsuario = await newUsuario.save();
        res.json(savedUsuario);
  
    } catch(error){

        res.status(500).json({ err: error.message});
    }



   
}

// login route setup
const login_authenticate =  async (req, res) => {
    try {
        
        const email = req.body.email;
        const password = req.body.password;
  
      // validate

        if(!email || !password) return res.status(400).json({message:" Missing data"});
  
      // checking email that was entered and comparing email in our database
      const userWithEmail = await Usuario.findOne({ email: email });
      
      if (!userWithEmail) {
        return res
          .status(400)
          .json({ msg: "Wrong Email" });
      }
  
      // Checking password entered and comparing with hashed password in database
      const isMatch = await bcrypt.compare(password, userWithEmail.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
  
      // Creating our json web token by passing the user id and our JWT_SECRET
      const jwtToken = jwt.sign({ id: userWithEmail._id }, process.env.JWT_SECRET);
      res.json({message: "Welcome Back!", token:jwtToken,userWithEmail});
    } catch (error) {
      res.status(500).json({ err: error.message });
    }

  };
  












 module.exports = {

    login_register,login_authenticate

 }
