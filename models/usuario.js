// Este file ha sido creado con el fin de crea un Schema de los datos que va a tener casa usuario. Es decir un MODEL de angular.
//Primero tenemos que importar mongoose. Ya que vamos a usar shortcuts de mongoose.

const mongoose = require('mongoose');

//Creamos el Schema con shortcut

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({

    name: {
        type:String,
        required: true
    },

    email: {
        type:String,
        required:true,
        unique:true

    },
    username:{

        type:String,
        required:true
    },
    password:{

        type:String,
        required:true,
        minlength: 5
    }


},{ timestamps: true});

//Ahora que ya hemos creado el schema. tenemos que crear el Model. El model va a hacer posible la comunicacion con la database 
//Debemos ponerlo con la primera en mayuscula y en singular. 
// Importante!! Hay que ponerlo en singular porque luego el metodo va  a buscar USUARIO pero el plural en la base de datos, por lo que en
//la DB hay que poner como titulo de la coleccion siempre en plural

const Usuario = mongoose.model('Usuario',usuarioSchema);

//Lo ultimo debemos exportar para porder utilizarlo fuera de este file.

module.exports = Usuario;