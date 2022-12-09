"use strict";
const express = require("express");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const path = require("path");
const bodyParser = require("body-parser");
const config = require("./config.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//Configuración middleware sesión

const MySQLStore = mysqlSession(session);

const sessionStore = new MySQLStore({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
},require('./data/pool').getPool());

const middlewareSession = session({
    saveUninitialized: false,
    secret: "footbar34",
    resave: false,
    store: sessionStore
});

app.use(middlewareSession);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const ficherosEstaticos = path.join(__dirname, "public");
app.use(express.static(ficherosEstaticos));

app.listen(config.port, function (err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " + err.message);
    } else {
        console.log("Servidor arrancado en el puerto " + config.port);
    }
});

const userR = require("./routes/userRoute");
const indexR = require("./routes/indexRoute");
//const aviso = require("./routes/aviso");

app.use('/', userR);
app.use('/', indexR);
//app.use('/', aviso);
/* 
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
}); */