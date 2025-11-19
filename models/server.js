
const express = require('express')
const cors = require('cors')
const { bdmysqlNube } = require('../database/mySqlConnection');
const { dbConnectionNeo4j } = require('../database/myNeo4jConnection');



class Server {




    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        
        this.paths = {
            auth:     "/api/auth",
            user: "/api/usuarios",
            sitios:   "/api/sitios",
            platos:   "/api/platos",
            famosos:  "/api/famosos",
            consumos: "/api/consumos",
            paises:   "/api/paises",
            ciudades: "/api/ciudades"
        };

        /*this.pathsMySql = {
            auth: '/api/auth',
            prueba: '/api/prueba',
            heroes: '/api/heroes',
            usuarios: '/api/usuarios',
            estudiantes: '/api/estudiantes'
        };*/

        this.conectarBDNeo4j();
        this.middlewares();
        this.routes();



        this.app.get('/', function (req, res) {
            res.send('Hola Mundo a todos desde la Clase...')
        })


        //Aqui me conecto a la BD
        this.conectarBDNeo4j()
        //this.dbConnection();


        //Middlewares
        this.middlewares();


        //Routes
        this.routes();


    }

    async conectarBDNeo4j(){
        await dbConnectionNeo4j();
    }



    async dbConnection() {
        try {
            await dbConnectionNeo4j.authenticate();
            console.log('Connection OK a MySQL.');
        } catch (error) {
            console.error('No se pudo Conectar a la BD MySQL', error);
        }
    }


    routes() {


        this.app.get('/api', (req, res) => {
            //res.send('Hello World')
            res.json({
                ok: true,
                msg: 'get API'
            })


        });




        this.app.post('/api', (req, res) => {
            //res.send('Hello World')
            res.status(201).json({
                ok: true,
                msg: 'post API'
            })




        });




        this.app.put('/api', (req, res) => {
            //res.send('Hello World')
            res.json({
                ok: true,
                msg: 'put API'
            })




        });




        this.app.delete('/api', (req, res) => {
            //res.send('Hello World')
            res.json({
                ok: true,
                msg: 'delete API'
            })




        });


        this.app.patch('/api', (req, res) => {
            //res.send('Hello World')
            res.json({
                ok: true,
                msg: 'patch API'
            })




        });

        
        
        /* 
        this.app.use(this.paths.auth, require('../routes/auth.route'));
        this.app.use(this.paths.heroes, require('../routes/heroes.route'));

        //Rutas de Usuarios
        this.app.use(this.paths.usuarios, require('../routes/usuarios.route'));

        this.app.use(this.paths.estudiantes, require('../routes/estudiantes.route'));
        */
        this.app.use(this.paths.auth, require("../routes/auth.route"));
        this.app.use(this.paths.user, require("../routes/user.route"));

        this.app.use(this.paths.ciudades, require("../routes/ciudades.route"));
        this.app.use(this.paths.sitios, require("../routes/sitios.route"));
        this.app.use(this.paths.platos, require("../routes/platos.route"));
        this.app.use(this.paths.famosos, require("../routes/famosos.route"));
        this.app.use(this.paths.consumos, require("../routes/consumo.route"));
        this.app.use(this.paths.paises, require("../routes/paises.route"));
        
        
        


    }






   
    middlewares() {
        //CORS
        //Evitar errores por Cors Domain Access
        //Usado para evitar errores.
        this.app.use(cors());


        //Lectura y Parseo del body
        //JSON
       
        //JSON (JavaScript Object Notation)
        //es un formato ligero de intercambio de datos.
        //JSON es de fácil lectura y escritura para los usuarios.
        //JSON es fácil de analizar y generar por parte de las máquinas.
        //JSON se basa en un subconjunto del lenguaje de programación JavaScript,
        //Estándar ECMA-262 3a Edición - Diciembre de 1999.
       
        this.app.use(express.json());


        //Directorio publico
        this.app.use(express.static('public'));


    }

    
   


    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }


}


module.exports = Server;
