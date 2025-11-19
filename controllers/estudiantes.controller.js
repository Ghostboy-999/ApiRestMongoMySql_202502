const { response, request } = require('express')
const { Estudiantes } = require('../models/mySqlEstudiantes.model');
const { bdmysqlNube } = require('../database/mySqlConnection');




//SELECT * FROM heroes
const estudiantesGet = async (req, res = response) => {

    try {
        const unosEstudiantes = await Estudiantes.findAll();

        res.json({
            ok: true,
            data: unosEstudiantes
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador',
            err: error
        })

    }
}


const estudianteIdGet = async (req, res = response) => {


    const { idestudiante } = req.params;


    try {


        const unEstudiante = await Estudiantes.findByPk(idestudiante);




        if (!unEstudiante) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un Estudiante con el id: ' + idestudiante
            })
        }




        res.json({
            ok: true,
            data: unEstudiante
        });




    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador',
            err: error
        })




    }

}




const estudiantesComoGet = async(req = request, res = response) => {

        const idcarrera = req.params.idcarrera;


    try {
        const [results, metadata] = await bdmysqlNube.query(
            "SELECT e.idestudiante, e.nombres, e.apellidos, e.estado, c.nombre AS carrera "+
            "FROM estudiantes e " +  
            "INNER JOIN carreras c ON e.idcarrera = c.idcarrera "+
            "WHERE e.idcarrera = c.idcarrera"

        );


        res.json({ok:true,
            data: results,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ok:false,
            msg: 'Hable con el Administrador',
            err: error




        });
    }
};


const estudiantesPost = async (req, res = response) => {

    const {idestudiante, nombres, apellidos, estado, idcarrera} = req.body;

    const estudiante = new Estudiantes({idestudiante, nombres, apellidos, estado, idcarrera});

    try {


        const existeEstudiante = await Estudiantes.findOne({ where: { idestudiante: idestudiante} });


        if (existeEstudiante) {
            return res.status(400).json({ok:false,
                msg: 'Ya existe un estudiante con el id' + idestudiante
            })
        }




        // Encriptar la contraseña
        //const salt = bcryptjs.genSaltSync();
        //usuario.password = bcryptjs.hashSync(password, salt);


        // Guardar en BD
        newEstudiante = await estudiante.save();


        //console.log(newHeroe.null);
        //Ajusta el Id del nuevo registro al Heroe
        estudiante.idestudiante = newEstudiante.null;


        res.json({ok:true,
            msg:'Estudiante INSERTADO',
            data:estudiante
        });




    } catch (error) {
        console.log(error);
        res.status(500).json({ok:false,
            msg: 'Hable con el Administrador',
            err: error
        })




    }


}

//UPDATE heroe
//SET var = ,
//      var1 = ?
//WHERE id = :id
const estudiantePut = async (req, res = response) => {


    const { idestudiante } = req.params;
    const { body} = req;
   //const { _id, password, google, correo, ...resto } = req.body;


    console.log(idestudiante);
    console.log(body);


    try {


        const estudiante = await Estudiantes.findByPk(idestudiante);


        if (!estudiante) {
            return res.status(404).json({ok:false,
                msg: 'No existe un estudiante con el id: ' + id
            })
        }


        console.log(body)
       
        await estudiante.update(body);


        res.json({
            ok:true,
            msg:"Estudiante Actualizado",
            data:estudiante
        });
   


    } catch (error) {
        console.log(error);
        res.status(500).json({ok:false,
            msg: 'Hable con el Administrador',
            err: error
        })


    }




}

const estudianteDelete = async (req, res = response) => {
   
    const { idestudiante } = req.params;


    console.log(idestudiante);
 
    try {


        const estudiante = await Estudiantes.findByPk(idestudiante);


        if (!estudiante) {
            return res.status(404).json({ok:false,
                msg: 'No existe un estudiante con el id: ' + idestudiante
            })
        }


        //Borrado Logico.
        //await heroe.update({estado:false});


        //Borrado de la BD
        await estudiante.destroy();


        res.json({ok:true,
            msg:"Estudiante Eliminado",
            estudiante:estudiante,
        });
   




    } catch (error) {
        console.log(error);
        res.status(500).json({ok:false,
            msg: 'Hable con el Administrador',
            err: error
        })




    }
}





module.exports = {
    estudiantesGet,
    estudianteIdGet,
    estudiantesComoGet,
    estudiantesPost,
    estudiantePut,
    estudianteDelete
}