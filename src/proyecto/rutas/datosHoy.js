const { Router } = require('express');
const router = Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const { DateTime } = require("luxon");

//////////PARA USUARIOS
router.get('/datos-hoy/:id', (req, res) => {
    var id = req.params.id; //recogemos el parámetro enviado en la url
    let local = DateTime.local().setZone("America/Bogota")
    let startOfToday = local.startOf('day').toISO()
    let today = local.toISO()
    console.log(today)
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const query = {
            "datos.horaFecha": {
                $gte: startOfToday,
                $lt: today
            }, "id": parseInt(id)
        }
        var dbo = db.db("caliDatos");
        dbo.collection("datosNodo").find(query).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
            db.close();
        });
    });
});

////////ENTES GUBERNAMENTALES

router.get('/datos-hoy', (req, res) => {
    let local = DateTime.local().setZone("America/Bogota")
    let startOfToday = local.startOf('day').toISO()
    let today = local.toISO()
    console.log(today)
    MongoClient.connect(url, function (err, db) {
        if (err) throw err
        const query = {
            "datos.horaFecha": {
                $gte: startOfToday,
                $lt: today
            }
        }
        var dbo = db.db("caliDatos");
        dbo.collection("datosNodo").find(query).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
            db.close();
        });
    });
});

router.get('/datos-hoy-zona/:idzona', (req, res) => {
    var idzona = req.params.idzona; //recogemos el parámetro enviado en la url
    let local = DateTime.local().setZone("America/Bogota")
    let startOfToday = local.startOf('day').toISO()
    let today = local.toISO()
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const query = {
            "datos.horaFecha": {
                $gte: startOfToday,
                $lt: today
            }, "idzona": parseInt(idzona)
        }
        var dbo = db.db("caliDatos");
        dbo.collection("datosNodo").find(query).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
            db.close();
        });
    });
});

router.get('/datos', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("caliDatos");
        dbo.collection("datosNodo").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
            db.close();
        });
    });
});

router.get('/datos/:id', (req, res) => {
    var id = req.params.id; //recogemos el parámetro enviado en la url
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("caliDatos");
        var query = {};
        query.id = parseInt(id);
        //console.log(query);
        dbo.collection("datosNodo").find(query).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
            db.close();
        });
    });
});

module.exports = router;
