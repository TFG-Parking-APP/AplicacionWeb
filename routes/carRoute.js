"use strict";
const express = require("express");
const app = express();
const { check, validationResult } = require("express-validator");
const CarService = require("../services/carService");
const multer = require("multer");
const multerFactory = multer({ storage: multer.memoryStorage() });

let carService = new CarService();

app.post("/newCar",
    multerFactory.single('image'),
    function (request, response) {
        
    let usuario = request.session.usuario;
    if (usuario){
        carService.newCar(request, response, request.file, usuario.id);
    }
    else{
        response.redirect("login");
    }
});

app.get("/imagenCoche/:id", (request, response) =>
    carService.getImage(request, response)
);

app.post("/carMove",function (request, response) { 
    console.log(request);
    console.log(request.body.plate);
    response.status(200);
    response.end;
});

module.exports = app;