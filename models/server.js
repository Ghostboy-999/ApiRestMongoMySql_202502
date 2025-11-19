
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
            user:     "/api/usuarios",  // ⬅️ Cambia "user" por lo que usas
            sitios:   "/api/sitios",
            platos:   "/api/platos",
            famosos:  "/api/famosos",
            consumos: "/api/consumos",
            paises:   "/api/paises",
            ciudades: "/api/ciudades"
        };

        // ⬇️ IMPORTANTE: Este orden es crucial
        this.conectarBDNeo4j();
        this.middlewares();  // ⬅️ PRIMERO los middlewares
        this.routes();       // ⬅️ DESPUÉS las rutas
    }

    async conectarBDNeo4j(){
        await dbConnectionNeo4j();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // ⬇️ CRÍTICO: Parseo de JSON DEBE estar aquí
        this.app.use(express.json());

        // Directorio público
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.get('/', function (req, res) {
            res.send('Hola Mundo a todos desde la Clase...')
        });

        this.app.get('/api', (req, res) => {
            res.json({
                ok: true,
                msg: 'get API'
            });
        });

        // ⬇️ Rutas de la API
        this.app.use(this.paths.auth, require("../routes/auth.route"));
        this.app.use(this.paths.user, require("../routes/user.route"));
        this.app.use(this.paths.ciudades, require("../routes/ciudades.route"));
        this.app.use(this.paths.sitios, require("../routes/sitios.route"));
        this.app.use(this.paths.platos, require("../routes/platos.route"));
        this.app.use(this.paths.famosos, require("../routes/famosos.route"));
        this.app.use(this.paths.consumos, require("../routes/consumo.route"));
        this.app.use(this.paths.paises, require("../routes/paises.route"));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;