"use strict"
const fs = require('fs');
const { check, validationResult } = require("express-validator");
const UserDAO = require("../data/userDAO");

class UserService {
    constructor() {
        this.userDAO = new UserDAO();
    }

    login(request, response, next) {
        const errors = validationResult(request);
        let email = request.body.email;
        let password = request.body.password;

        if (errors.isEmpty()) {
            this.userDAO.getUser(email, (err, result) => {
                if (err) {
                    console.log(err.message);
                    response.end();
                }
                else if (!result) {
                    console.log("no existe ese usuario");
                    response.render("login", { errors: [{param: "email", msg: "No existe ese correo", value: request.body.email}] });
                }
                else {
                    console.log("usuario encontrado");
                    if (password === result.password) {
                        let user = {
                            Id: result.id,
                            email: result.email,
                            nombre: result.name,
                            contraseña: result.password
                        }
                        request.session.usuario = user;
                        response.redirect("/");
                    }
                    else {
                        console.log("la contraseña no coincide" + password);
                        response.render("login", { errors: false });
                    }
                }
            });
        }
        else { //si hay errores
            console.log("la contraseña no coincide");
            response.render("login", { errors: errors.array() });
        }
    };

    signUp(request, response, reqFile) {
        let imagen = null;
        if (reqFile) {
            imagen = request.file.buffer;
        }
        else {
            imagen = fs.readFileSync("./public/images/logoUCM.jpg");
        }
        // Password Format
        let password = (request.body.password === request.body.password2);
        let up = request.body.password.toUpperCase();
        let low = request.body.password.toLowerCase();
        if (request.body.password === low || request.body.password === up) {
            password = false
        }
        
        const errors = validationResult(request);
        console.log(errors, password);
        if (errors.isEmpty() && password) { 
            this.userDAO.newUser(request.body.name, request.body.email, request.body.password, imagen,
                (err) => {
                    if (err) {
                        console.log(err.message);
                        response.status(500);
                        response.end();
                    }
                    else {
                        response.status(200);
                        response.render("login", { errores: false });   
                    } 
                });
        }
        else {
            response.render("signUp.ejs", { errors: errors.array()});//, {errores: errors.mapped()}
        }
    };

    getImage(request, response) {
        let n = Number(request.params.id);
        if (isNaN(n)) {
            response.status(400);
            response.end("Petición incorrecta");
        } else {
            this.userDAO.obtenerImagen(n, function (err, imagen) {
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

    getAllUsers(callback) {
        this.userDAO.getAllUsers((err, result) => {
            if (err) {
                console.log(err.message);
                callback(false);
            }
            else if (!result) {
                console.log("no hay usuarios activos");
                callback(false);
            }
            else {
                result.forEach(element => {
                    element.fecha = element.fecha.slice(0, 19).replace('T', ' ');
                });
                callback(result);
            }
        });
    };

    getUserByName(query, callback) {
        this.userDAO.getUserByName(query,(err, result) => {
            if (err) {
                console.log(err.message);
                callback(false);
            }
            else if (!result) {
                console.log("no hay usuarios con ese nombre");
                callback(false);
            }
            else {
                callback(result);
            }
        });
    }

    getProfile(idUsu, callback) {

        this.userDAO.getUserById(idUsu, function (err, user) {
            if (err) {
                console.log(err.message);
                callback(false);
            }
            else if (!user) {
                console.log("usuaio no encontrado");
                callback(false);
            }
            else {
                callback(user);
            }
        });

    };

    deleteUser(idUsu, callback) {
        this.userDAO.deleteUser(idUsu, (err, result) => {
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