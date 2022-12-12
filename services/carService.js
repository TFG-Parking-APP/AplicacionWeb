"use strict"
const fs = require('fs');
const { check, validationResult } = require("express-validator");
const CarDAO = require("../data/carDAO");

class UserService {
    constructor() {
        this.carDAO = new CarDAO();
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
};




module.exports = UserService;