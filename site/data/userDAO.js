"use strict"

class UserDAO {
    constructor() {
        this.pool = require('../data/pool').getPool();
    }

    getUser(email, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            }
            else {
                const sql = "SELECT * FROM user WHERE email = ?";
                connection.query(sql, [email],
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
                                let json = JSON.parse(JSON.stringify(row));
                                let user = json[0];
                                callback(null, user);
                            }
                        }
                    })
            }
        })
    }

    newUser(nombre, email, contraseña, imagen, callback) {
        console.log('hola')
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            } else {
                const sql = "INSERT INTO user (name, email, password, image) VALUES (?, ?, ?, ?)";
                connection.query(sql, [nombre, email, contraseña, imagen],
                    function (err) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error al acceso a la base de datos"));
                            console.log(err.stack);
                        }
                        else {
                            console.log('Usuario dado de alta correctamente')
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
                let sql = "SELECT image FROM user WHERE id = ?";
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

    getAllUsers(callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            }
            else {
                const sql = "SELECT * FROM ucm_aw_cau_usu_usuarios WHERE activo = true";
                connection.query(sql,
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
                                let usuarios = [];
                                row.forEach(element => {
                                    let json = JSON.parse(JSON.stringify(element));
                                    usuarios.push(json);
                                });
                                
                                callback(null, usuarios);
                            }
                        }
                    })
            }
        });
    };

    getUserById(idUsu,callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            }
            else {
                const sql = "SELECT * FROM ucm_aw_cau_usu_usuarios WHERE Id = ?";
                connection.query(sql,[idUsu],
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
                                callback(null, JSON.parse(JSON.stringify(row[0])));
                            }
                        }
                    })
            }
        });
    };

    /* getUserByName(query,callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            }
            else {
                const sql = "SELECT * FROM ucm_aw_cau_usu_usuarios WHERE nombre LIKE ?";
                connection.query(sql,['%' + query + '%'],
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
                                let usuarios = [];
                                row.forEach(element => {
                                    let json = JSON.parse(JSON.stringify(element));
                                    usuarios.push(json);
                                });
                                
                                callback(null, usuarios);
                            }
                        }
                    })
            }
        });
    }; */


    deleteUser(idUsu, callback) {
        //console.log(userId);
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            }
            else {
                const sql = "DELETE FROM ucm_aw_cau_usu_usuarios WHERE Id = ?";
                connection.query(sql, idUsu ,
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

    

        
    

}

module.exports = UserDAO;