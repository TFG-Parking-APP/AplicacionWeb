"use strict";
const express = require("express");
const app = express();
const { check, validationResult } = require("express-validator");
const CarService = require("../services/carService");
const multer = require("multer");
const UserService = require("../services/userService");
const multerFactory = multer({ storage: multer.memoryStorage() });

let carService = new CarService();
let userService = new UserService();

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
        carService.getCarById(request.params.id, request.session.usuario.name, (car) => {
            response.status(200);

            //comprbamos que el user de la sesion sea el mismo que el del coche
            if (!car) {
                //si no son sus coches le dovelmos a la vista principal
                carService.getCarsUser(usuario.id, (cars) => {
                    response.render("index", { usuario, coches: cars });
                })
            } else {
                carService.getCarHistory(request.params.id, (history) => {
                    if (!history) history = [];
                    response.render("car.ejs", { usuario, coche: car[0], history: history });
                })
            }
        })

    } else {
        response.redirect("login");
    }
});

app.post("/enterParking/:plate", function(request, response) {
    response.status(200);
    carService.enterParking(request.params.plate, (status) => response.json({'status' : status}));
});

app.post("/leaveParking/:plate", function(request, response) {
    response.status(200);
    carService.leaveParking(request.params.plate, (status) => response.json({'status' : status}));
});

app.get("/datosPago", function(request, response) {
    carService.calculatePrice(request.query.carId, (precio, parsedTime) => {
        response.status(200);
        response.json({ resultado: precio +' €', tiempoEstacionado: parsedTime + ' minutos' });
    });
});

app.post("/pagar", function(request, response) {
    carService.pay(request.body.carId, request.body.price,() => {
        response.status(200);
        response.redirect("login");
    })
    
});

app.get("/metepruebacoche/:plate", function(request, response) {
    response.status(200);
    carService.enterParking(request.params.plate, () => response.json({estado : "bien"}));
});

module.exports = app;