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
    function(request, response) {

        let usuario = request.session.usuario;
        if (usuario) {
            carService.newCar(request, response, request.file, usuario.id);
        } else {
            response.redirect("login");
        }
    });

app.get("/imagenCoche/:id", (request, response) =>
    carService.getImage(request, response)
);

app.get("/car/:id", (request, response) => {
    let usuario = request.session.usuario;
    if (usuario) {
        carService.getCarById(request.params.id, (car) => {
            response.status(200);
            response.render("car.ejs", { usuario, coche: car[0] });
        })

    } else {
        response.redirect("login");
    }
});

app.post("/carMove/:plate", function(request, response) {
    response.status(200);
    console.log(request.params.plate);
    console.log(request.body);
    response.end;
});

app.get("/datosPago", function(request, response) {
    response.status(200);
    let numero = request.query.carId;
    console.log(numero);
    response.json({ resultado: '20 €', tiempoEstacionado: '3 horas' });
});

app.post("/pagar", function(request, response) {
    response.status(200);
    response.redirect("login");
});

module.exports = app;