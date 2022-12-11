"use strict"

const express = require("express");
const app = express();
const CarService = require("../services/carService");

let carService = new CarService();
app.get("/", function (request, response) {
    let usuario = request.session.usuario;
    if (usuario){
        carService.getCarsUser(usuario.id , (cars) => {
            response.status(200);
            response.render("index", {usuario, coches: cars });
        })
        
    }
    else{
        response.redirect("login");
    }
});

module.exports = app;