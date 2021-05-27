const { Router } = require('express');
const router = Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const { DateTime } = require("luxon");

//////////PARA USUARIOS
router.get('/datos-actuales/:id', (req, res) => {
    var id = req.params.id; //recogemos el parámetro enviado en la url
    let local = DateTime.local().setZone("America/Bogota")
    let startOfWeek = local.startOf('week').toISO()
    let today = local.toISO()
    console.log(today)
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const findQuery = {
            "id": parseInt(id)
        }
        const sortQuery = {
            "datos.horaFecha": -1,
        }
        var dbo = db.db("caliDatos");
        dbo.collection("datosNodo").find(findQuery).sort(sortQuery).limit(1).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
            db.close();
        });
    });
});

////////ENTES GUBERNAMENTALES

module.exports = router;
