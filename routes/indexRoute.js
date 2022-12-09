"use strict"

const express = require("express");
const app = express();
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
app.get("/", function (request, response) {
    let usuario = request.session.usuario;
    if (usuario){
        response.status(200);
        response.render("index", {usuario, coches: json });
    }
    else{
        response.redirect("login");
    }
});

module.exports = app;