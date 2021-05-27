const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost')
// const mysql = require('mysql')
const { DateTime } = require("luxon")
const MongoClient = require('mongodb').MongoClient
const url = "mongodb://localhost:27017/"
/////////////TESTS GOZONES XDDD//////////////////////////////////
// let local = DateTime.local().setZone("America/Bogota")
// let horaFecha = local.plus({weeks :-1}).toISO()
// console.log(horaFecha)
// console.log(typeof(horaFecha))
////////////////////////////////////////////////conexion a firebase
const firebase = require("firebase/app");
require('firebase/database');

const firebaseConfig = {
    apiKey: "AIzaSyC68gJb5QbZL8K8f_dYvWdfEqDhgpL6eCA",
    authDomain: "projectappci.firebaseapp.com",
    databaseURL: "https://projectappci-default-rtdb.firebaseio.com",
    projectId: "projectappci",
    storageBucket: "projectappci.appspot.com",
    messagingSenderId: "774294994825",
    appId: "1:774294994825:web:ed9b184d200cf5f4adab58"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
////////////////////////////////////////////////cierre de conexion firebase

/////////variables globales
let ultimoDatoPresion
let setUltimoDatoPresion = true
let mensajeFuga = null

client.on('connect', function () {
    client.subscribe('caliDatos', function (err) {
        if (err) {
            console.log("error en la subscripcion")
        }
        console.log("me prueba mi rey")
    })
})

////////////////////////////////////////////////ENVIO DE MENSAJES A MONGODB POR MEDIO DE MQTT
client.on('message', function (topic, message) { //Mongo DB
    // message is Buffer
    const json1 = JSON.parse(message.toString());

    let id = json1.id
    let idzona = json1.idzona
    let caudal = json1.caudal
    let turbidez = json1.turbidez
    let presion = json1.presion
    let consumo = json1.consumo

    let local = DateTime.local().setZone("America/Bogota")
    //////////lectura de fecha para humanos
    // let horaFecha = local.toLocaleString(DateTime.DATETIME_SHORT)
    //////////lectura de fecha para programas
    let horaFecha = local.toISO()
    // let horaFecha = local.plus({weeks :-1}).toISO()

    if (setUltimoDatoPresion) {
        ultimoDatoPresion = presion
        setUltimoDatoPresion = !setUltimoDatoPresion
    }

    const datos = {
        id,
        idzona,
        datos:{
            caudal,
            turbidez,
            presion,
            consumo,
            horaFecha
        },
        alertas:{
            presion: alertaPresion(presion),
            caidaDePresion: alertaCaidaPresion(presion),
            calidadDeAgua: alertaAguaTurbia(turbidez)
        }
    }

    //client.publish('topico2', 'mensaje recibido')
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("caliDatos");
        dbo.collection("datosNodo").insertOne(datos, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });

    //client.end() //si se habilita esta opción el servicio termina
});

////////////////////////////////////////////////ENVIO DE MENSAJES A FIREBASE POR MEDIO DE MQTT
// client.on('message', function (topic, message) { //Mongo DB
//     // message is Buffer
//     const json1 = JSON.parse(message.toString());

//     let idnodo = json1.idnodo
//     let lluvia = json1.lluvia
//     let turbidez = json1.Turbidez
//     let nivel = json1.Nivel_del_agua
//     let horafecha = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)

//     firebase.database().ref('Datos/').push({
//         idnodo,
//         lluvia,
//         turbidez,
//         nivel,
//         horafecha
//     });

//     console.log(`New data sent to Firebase: idnodo= ${idnodo}, lluvia= ${lluvia},turbidez= ${turbidez},nivel= ${nivel},horafecha= ${horafecha}.}`)
// });

const alertaAguaTurbia = (turbidez) => {
    if (turbidez > 5) {
        return `agua no apta para el consumo humano`
    } else if (turbidez > 1) {
        return `baja calidad en el agua`
    }
    return `agua en perfecto estado`
}

const alertaPresion = (presion) => {
    if (presion < 73) {
        return `posible suspension de servicio por baja presion`
    }
    return
}

const alertaCaidaPresion = (presion) => {
    let diferencia = ultimoDatoPresion - presion
    if (diferencia > 20 && presion < 73) {
        mensajeFuga = `posible fuga de tuberias del sector`
        return mensajeFuga
    }
    if(presion >= 120){
        mensajeFuga = null
    }
    ultimoDatoPresion = presion
    return mensajeFuga
}

const calcularConsumo = (consumo) => {
    const tarifaEstrato3 = 1.93028
    return consumo * tarifaEstrato3
}

///////////////////////////Funcion para la aplicación web (se necesita la información de consumo de toda una zona )
// const calcularConsumoDeZona = (consumo) => {
    //     if (consumos.length === 16) {
        //         let sumaDeConsumos
        //         consumos.forEach((dato) => {
            //             sumaDeConsumos += dato
            //         })
            //         let promedio = sumaDeConsumos / consumos.length
            //         consumos = []
            //         consumos.push(consumo)
            //         return `promedio de consumo en la zona: ${promedio}`
            //     }
            //     consumos.push(consumo)
            //     return
            // }
                      
///////////////////////////Funcion para la aplicación web (se necesita la información de caudal de cada nodo por separado)
// const promedioCaudalDia = (caudal) => {
//     if (caudales.length === 5) {
//         let sumaDeCaudales
//         caudales.forEach((dato) => {
//             sumaDeCaudales += dato
//         })
//         let promedio = sumaDeCaudales / caudales.length
//         caudales = []
//         caudales.push(caudal)
//         return `promedio caudal: ${promedio}`
//     }
//     caudales.push(caudal)
//     return
// }