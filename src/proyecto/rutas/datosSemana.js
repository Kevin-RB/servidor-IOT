const { Router } = require('express');
const router = Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const { DateTime } = require("luxon");

//////////PARA USUARIOS
router.get('/datos-semana/:id', (req, res) => {
    var id = req.params.id; //recogemos el parámetro enviado en la url
    let local = DateTime.local().setZone("America/Bogota")
    let startOfWeek = local.startOf('week').toISO()
    let today = local.toISO()
    console.log(today)
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("caliDatos");
        dbo.collection("datosNodo").find({
            "datos.horaFecha": {
                $gte: startOfWeek,
                $lt: today
            }, "id": parseInt(id)
        }).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
            db.close();
        });
    });
});

////////ENTES GUBERNAMENTALES
router.get('/datos-semana', (req, res) => {
    let local = DateTime.local().setZone("America/Bogota")
    let startOfWeek = local.startOf('week').toISO()
    let today = local.toISO()
    console.log(today)
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("caliDatos");
        dbo.collection("datosNodo").find({
            "datos.horaFecha": {
                $gte: startOfWeek,
                $lt: today
            }
        }).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
            db.close();
        });
    });
});

router.get('/datos-semana-zona/:idzona', (req, res) => {
    var idzona = req.params.idzona; //recogemos el parámetro enviado en la url
    let local = DateTime.local().setZone("America/Bogota")
    let startOfWeek = local.startOf('week').toISO()
    let today = local.toISO()
    console.log(today)
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("caliDatos");
        dbo.collection("datosNodo").find({
            "datos.horaFecha": {
                $gte: startOfWeek,
                $lt: today
            }, 'idzona' : parseInt(idzona)
        }).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
            db.close();
        });
    });
});

module.exports = router;