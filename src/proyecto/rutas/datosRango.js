const { Router } = require('express');
const router = Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const { DateTime } = require("luxon");

//////////PARA USUARIOS
router.get('/datos-rango/:id', (req, res) => {
    let id = req.params.id; //recogemos el parámetro enviado en la url 
    const dateRanges = req.body

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const query = {
            "datos.horaFecha": {
                $gte: dateRanges.inicio,
                $lt: dateRanges.fin
            }, "id": parseInt(id)
        }
        const sortQuery = {
            "datos.horaFecha": 1,
        }
        var dbo = db.db("caliDatos");
        dbo.collection("datosNodo").find(query).sort(sortQuery).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
            db.close();
        });
    });
});

router.get('/datos-rango-zona/:idzona/:inicio/:fin', (req, res) => {
    let inicio = req.params.inicio
    let fin = req.params.fin
    let idzona = req.params.idzona; //recogemos el parámetro enviado en la url

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const query = {
            "datos.horaFecha": {
                $gte: inicio,
                $lt: fin
            }, "idzona": parseInt(idzona)
        }
        const sortQuery = {
            "datos.horaFecha": 1,
        }
        var dbo = db.db("caliDatos");
        dbo.collection("datosNodo").find(query).sort(sortQuery).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
            db.close();
        });
    });
});

router.get('/datos-rango', (req, res) => {
    const dateRanges = req.body
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const query = {
            "datos.horaFecha": {
                $gte: dateRanges.inicio,
                $lt: dateRanges.fin
            }
        }
        const sortQuery = {
            "datos.horaFecha": 1,
        }
        var dbo = db.db("caliDatos");
        dbo.collection("datosNodo").find(query).sort(sortQuery).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
            db.close();
        });
    });
});

////////ENTES GUBERNAMENTALES
module.exports = router;