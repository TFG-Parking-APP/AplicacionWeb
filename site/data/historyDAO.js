"use strict"

class HistoryDAO {
    constructor() {
        this.pool = require('../data/pool').getPool();
    }

    getHistoryCar(idCar, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            }
            else {
                const sql = "SELECT * FROM history WHERE carId = ?";
                connection.query(sql, [idCar],
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
                                let history = JSON.parse(JSON.stringify(row));
                                callback(null, history);
                            }
                        }
                    })
            }
        })
    }


    carEntry(carId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            } else {
                const sql = "INSERT INTO car (carId, entryTime) VALUES (?, ?)";
                connection.query(sql, [carId, new Date().toISOString()],
                    function (err) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error al acceso a la base de datos"));
                            console.log(err.stack);
                        }
                        else {
                            console.log('Coche entra ' + carId + ' parking')
                            callback(null);
                        }
                    })
            }
        })
    }


    carExit(carId, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            } else {
                const sql = "INSERT INTO car (carId, entryTime) VALUES (?, ?)";
                connection.query(sql, [carId, new Date().toISOString()],
                    function (err) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error al acceso a la base de datos"));
                            console.log(err.stack);
                        }
                        else {
                            console.log('Coche entra ' + carId + ' parking')
                            callback(null);
                        }
                    })
            }
        })
    }

    

    

    

        
    

}

module.exports = HistoryDAO;