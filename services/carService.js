"use strict"
const fs = require('fs');
const { check, validationResult } = require("express-validator");
const CarDAO = require("../data/carDAO");
const HistoryDAO = require('../data/historyDAO');

class UserService {
    constructor() {
        this.carDAO = new CarDAO();
        this.historyDAO = new HistoryDAO();
    }

    newCar(request, response, reqFile, idUsu) {
        let imagen = null;
        if (reqFile) {
            imagen = request.file.buffer;
        }
        else {
            imagen = fs.readFileSync("./public/images/logoUCM.jpg");
        }
        
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            this.carDAO.newCar(request.body.name, request.body.plate, imagen, idUsu,
                (err) => {
                    if (err) {
                        console.log(err.message);
                        response.status(500);
                        response.end();
                    }
                    else {
                        response.status(200);
                        response.redirect("/");   
                    } 
                });
        }
        else {
            response.redirect("/");
            //response.render("signUp.ejs", { errors: errors.array()});//, {errores: errors.mapped()}
        }
    };

    getImage(request, response) {
        let n = Number(request.params.id);
        if (isNaN(n)) {
            response.status(400);
            response.end("Petición incorrecta");
        } else {
            this.carDAO.obtenerImagen(n, function (err, imagen) {
                if (imagen) {
                    response.end(imagen);
                } else {
                    response.status(404);
                    response.end("Not found");
                    //response.end("./public/images/logoUCM.jpg");
                }
            });
        }
    };

    getCarsUser(idUsu, callback) {
        this.carDAO.getCarsUser(idUsu, (err, result) => {
            if (err) {
                console.log(err.message);
                callback(false);
            }
            else if (!result) {
                console.log("xzc");
                callback(false);
            }
            else {/* 
                result.forEach(element => {
                    element.fecha = element.fecha.slice(0, 19).replace('T', ' ');
                }); */
                callback(result);
            }
        });
    };

   

    deleteUser(idCar, callback) {
        this.carDAO.deleteCar(idCar, (err, result) => {
            if (err) {
                console.log(err.message);
                //response.end();
                callback(false);
            }
            else if (!result) {
                console.log("No existe el usurio");
                callback(false);
                //response.render("login", {errores: false});
            }
            else {
                callback(result);
            }
        });
    };

    getCarById(idCar, userName, callback) {
        this.carDAO.getCarById(idCar, userName, (err, car) => {
            if (err) {
                console.log(err.message);
                //response.end();
                callback(false);
            }
            else if (!car) {
                console.log("No existe el coche con ese id");
                callback(false);
                //response.render("login", {errores: false});
            }
            else {
                callback(car);
            }
        });
    };

    getCarHistory(idCar, callback) {
        this.carDAO.getCarHistory(idCar, (err, car) => {
            if (err) {
                console.log(err.message);
                callback(false);
            }
            else if (!car) {
                console.log("No hay historial de ese coche");
                callback(false);
                //response.render("login", {errores: false});
            }
            else {
                callback(car);
            }
        });
    };

    enterParking(carPlate, callback){
        this.carDAO.getCarByPlate(carPlate, (err, car) => {
            //hay que comprobar que el coche no este dentro ya
            if(car.status == 1){
                console.log("el coche ya esta dentro")
                callback(false);
            }
            else{
                this.historyDAO.carEntry(car.id, () => {
                    this.carDAO.updateStatusIn(car.id, () => {
                        callback(true);
                    });
                });
            }
        });
    };

    leaveParking(carPlate, callback){
        this.carDAO.getCarByPlate(carPlate, (err, car) => {
            if(car.status == 0){
                console.log("el coche ya esta fuera");
                callback(false);
            }
            else{
                this.historyDAO.carExit(car.id, (pagado) => {
                    if(pagado){
                        this.carDAO.updateStatusOut(car.id, () => {
                            callback(true);
                        });
                    }
                    else {
                        callback(false);
                    }
                
                });
            }
        });
    };

    calculatePrice(carId, callback) {
        this.historyDAO.getLastEntryTime(carId, (err, time) => {
            const entTime = new Date(time.entryTime);
            const nowTime = new Date();
            const timeDiff = nowTime.getTime() - entTime.getTime();
            const parsedTime = Math.trunc((timeDiff / 1000) / 60); //minutos
            const precio = parsedTime * 0.05;
            callback(precio.toFixed(2), parsedTime);
        });
    };

    pay(carId, price, callback) {
        this.historyDAO.pay(carId, price, (err) => {
            callback();
        });
    };
};

module.exports = UserService;