const { Schema, model, Collection } = require('mongoose');


const HeroeSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    bio: {
        type: String,
        required: [true, 'La biografia es obligatoria'],
    },
    img: {
        type: String,
        required: [true, 'La imagen es obligatoria'],
    },
    aparicion: {
        type: Date,
        required: 'Debe tener una fecha de Aparicion'
    },
    casa: {
        type: String,
        required: [true, 'La casa es obligatoria'],
    }
},
{
  collection: 'Heroes'
}
);




HeroeSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Heroe', HeroeSchema );




// models/Heroe.js
/*
const mongoose = require('mongoose');


const heroeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  aparicion: {
    type: Date,
    required: true
  },
  casa: {
    type: String,
    enum: ['DC', 'Marvel'],
    required: true
  }
}, {
  collection: 'Heroes'
});


module.exports = mongoose.model('Heroe', heroeSchema);
*/
