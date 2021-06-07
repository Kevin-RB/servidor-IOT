const { Router } = require('express');
const router = Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const { DateTime } = require("luxon");


router.get('/datos-mes-zona/:idzona', (req, res) => {
    var idzona = req.params.idzona; //recogemos el parámetro enviado en la url
    let local = DateTime.local().setZone("America/Bogota")
    let startOfMonth = local.startOf('month').toISO()
    let today = local.toISO()
    console.log(today)
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("caliDatos");
        dbo.collection("datosNodo").find({
            "datos.horaFecha": {
                $gte: startOfMonth,
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