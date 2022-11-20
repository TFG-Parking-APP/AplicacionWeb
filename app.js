"use strict"
const http = require("http");
const url = require("url");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

//const session = require("express-session");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//para guardar la ruta de public
const ficherosEstaticos = path.join(__dirname, "public");

let json = [{
    "id": 132,
    "matricula": "CHS1710",
    "hora_ent": "16:50",
    "hora_sal": "17:30",
    "nombre": "Fiat"
},
{
    "id": 133,
    "matricula": "JFX4559",
    "hora_ent": "16:50",
    "hora_sal": false,
    "nombre": "Mini"
}
    ,
{
    "id": 133,
    "matricula": "JFX4559",
    "hora_ent": "16:50",
    "hora_sal": false,
    "nombre": "Mini"
}
    ,
{
    "id": 133,
    "matricula": "JFX4559",
    "hora_ent": "16:50",
    "hora_sal": false,
    "nombre": "Mini"
}
    ,
{
    "id": 133,
    "matricula": "JFX4559",
    "hora_ent": "16:50",
    "hora_sal": false,
    "nombre": "Mini"
}
    ,
{
    "id": 133,
    "matricula": "JFX4559",
    "hora_ent": "16:50",
    "hora_sal": false,
    "nombre": "Mini"
}
];

app.use(express.static(ficherosEstaticos));

app.get("/", function (request, response) {
    response.status(200);
    response.render("index", { coches: json });
    //console.log(json[0]["id"]);
});

app.listen(3000, function (err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " +
            err.message);
    } else {
        console.log("Servidor arrancado en el puerto 3000");
    }
});