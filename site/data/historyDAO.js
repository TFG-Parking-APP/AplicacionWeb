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
                const sql = "INSERT INTO history (carId, entryTime) VALUES (?, ?)";
                connection.query(sql, [carId, new Date().toISOString().slice(0, 19).replace('T', ' ')],
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
                const sql = "UPDATE history SET exitTime = ? WHERE carId = ? AND exitTime IS NULL AND price IS NOT NULL";
                connection.query(sql, [new Date().toISOString().slice(0, 19).replace('T', ' ') , carId],
                    function (err) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error al acceso a la base de datos"));
                            console.log(err.stack);
                        }
                        else {
                            console.log('Coche sale ' + carId + ' parking')
                            callback(null);
                        }
                    })
            }
        })
    }
    
    pay(carId, price, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            } else {
                const sql = "UPDATE history SET price = ? WHERE carId = ? AND exitTime IS NULL AND price IS NULL";
                connection.query(sql, [price , carId],
                    function (err) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error al acceso a la base de datos"));
                            console.log(err.stack);
                        }
                        else {
                            console.log('Pagado coche ' + carId + ' ' + price + ' euros')
                            callback(null);
                        }
                    })
            }
        })
    }

    getLastEntryTime(carId , callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            } else {
                const sql = "SELECT entryTime FROM history WHERE carId = ? AND exitTime IS NULL AND price IS NULL";
                connection.query(sql, [carId],
                    function (err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error al acceso a la base de datos"));
                            console.log(err.stack);
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false);
                            } else {
                                const time = rows[0];
                                callback(null, time);
                            }
                        }
                    })
            }
        })
    }
}

module.exports = HistoryDAO;