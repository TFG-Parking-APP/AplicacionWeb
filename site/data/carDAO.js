"use strict"

class CarDAO {
    constructor() {
        this.pool = require('../data/pool').getPool();
    }

    getCarsUser(idUsu, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            }
            else {
                const sql = "SELECT * FROM car WHERE userId = ?";
                connection.query(sql, [idUsu],
                    function (err, row) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error al acceso a la base de datos"));
                            console.log(err.stack);
                        }
                        else {
                            if (row.length === 0) {
                                callback(null, false);
                            }
                            else {
                                let cars = JSON.parse(JSON.stringify(row));
                                callback(null, cars);
                            }
                        }
                    })
            }
        })
    }

    newCar(name, plate, image, idUsu, callback) {
        console.log('hola')
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            } else {
                const sql = "INSERT INTO car (userId, name, plate, image, status) VALUES (?, ?, ?, ?, ?)";
                connection.query(sql, [idUsu, name, plate, image, false],
                    function (err) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error al acceso a la base de datos"));
                            console.log(err.stack);
                        }
                        else {
                            console.log('Coche dado de alta correctamente')
                            callback(null);
                        }
                    })
            }
        })
    }

    obtenerImagen(id, callback) {
        this.pool.getConnection(function (err, con) {
            if (err)
                callback(err);
            else {
                let sql = "SELECT image FROM car WHERE id = ?";
                con.query(sql, [id], function (err, result) {
                    con.release();
                    if (err) {
                        callback(err);
                    } else
                        // Comprobar si existe una persona con el Id dado.
                        if (result.length === 0)
                            callback("No existe");
                        else
                            callback(null, result[0].image);
                });
            }
        });
    }

    deleteCar(idCar, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            }
            else {
                const sql = "DELETE FROM car WHERE id = ?";
                connection.query(sql, idCar ,
                    function (err, row) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error al acceso a la base de datos"));
                            console.log(err.stack);
                        }
                        else {
                            if (row.length === 0) {
                                callback(null, false);
                            }
                            else {
                                callback(null, row);
                            }
                        }
                    })
            }
        });
    }

    getCarById(id, userName, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            }
            else {
                const sql = "SELECT * FROM car JOIN user ON car.userId = user.id WHERE car.id = ? AND user.name = ?";
                connection.query(sql, [id, userName],
                    function (err, row) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error al acceso a la base de datos"));
                            console.log(err.stack);
                        }
                        else {
                            if (row.length === 0) {
                                callback(null, false);
                            }
                            else {
                                let car = JSON.parse(JSON.stringify(row));
                                callback(null, car);
                            }
                        }
                    })
            }
        })
    }
}

module.exports = CarDAO;