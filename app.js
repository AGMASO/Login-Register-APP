/**
 * ! Importamos los modulos necesarios
 */
const express = require ('express');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const path = require ('path');
const cors = require ('cors');
const passport = require ('passport');
const config = require ('./config/database');
require("dotenv").config();
const auth = require('./config/auth');
/**
 * !Importante no olvidar importar la ruta de config/passport a la main app, si no no funciona
 */
require('./config/passport'); 


/**
 * ! Models and routes
 */
const Usuario = require ('./models/usuario');
const usuarioRoutes = require ('./routes/usuarioRoutes');
const { Passport } = require('passport/lib');
const req = require('express/lib/request');


//Starting modules Important

const app = express();

//Listen port
const port = process.env.PORT || 8080;

app.listen(port, ()=>{

    console.log('Server started on port '+ port);

});



//Connect Mongoose
mongoose.connect(config.database);

//On connected
mongoose.connection.on('connected', ()=>{

    console.log('Connected to Database '+config.database);
});

//On error
mongoose.connection.on('err', ()=>{

    console.log('Database error '+err);
});

/** 
 * ! MIDDLEWARES    
 */

//Config the CORS making us able to ask for req and res from to different ports in localhost

app.use(cors());

/**
 * * Para los headers y que no de problemas de cors
 */

// Configurar cabeceras y cors SUPER IMPORTANTE CUANDO TRABAJAMOS CON ANGULAR Y NODEJS PARA QUE NO DE FALLOS.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
/**
 * * END
 */

//Bodyparser

app.use(bodyParser.json());

//Para ordenar mucho mejor nuestra web, deberemos poner los Static Files(css o las imagenes,etc...) en un archivo a parte.
//normalmente se mete en un folder llamado PUBLIC. Pero para tener acceso desde el browser, debemos hacerlo público,
//si no no se podrá linkear. Para hacerlo público debemos usar un middleware integrado en express llamado EXPRESS.STATIC.
//Solo con eso conseguiremos hacerlo público y utilizarlo.
app.use(express.static(path.join(__dirname, 'public')));

//Middleware para los POST events. Viene incluido en Express. Hay que ponerlo para que funcione el metodo post.

app.use(express.urlencoded({extended:true}));


//Passport Middleware



/**
 * ! ROUTES
 */

 //Vamos a añadir un blog nuevo a la base de datos.Tarea TEST
 app.get('/add',(req,res)=>{
 
     const user = new Usuario({
 
         name : "Pepito grillo",
         email: "hola@info.com",
         username: "Lobezno",
         password:"12345"
     });
 
     user.save()
      .then((result)=>{
         res.send(result)
      })
      .catch((err)=>{
         console.log(err);
      });
 })

 /**
  * * POST METHOD
  */

 app.use(usuarioRoutes);
//EXPORT

/**
 * * AÑADIMOS UNA RUTA GET TRAS EL BUILD DE ANGULAR EN PUBLIC FILE, CON EL FIN DE QUE TODAS LAS URLS INDIQUEN AL ARCHIVO PUBLIC DONDE
 * * ESTÁ TODO METIDO. ES DECIR, LAS URLS QUE HEMOS MARCADO PARA QUE HAGAN REQ A LA API, SEGUIRAN FUNCIONANDO, Y SI EL SE REQUIERE OTRA 
 * * QUE NO ESTÁ DEFINIDA, NOS LLEVARA AL '/' DEL FOLDER PUBLIC.HTML
 */

app.get('*',(req,res)=>{

    res.sendFile(path.join(__dirname,'public/index.html'));
});

module.exports = app;
