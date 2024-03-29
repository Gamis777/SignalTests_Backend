const db = require("../models")
const Usuario = db.usuario
const Perfil = db.perfil
const Modulo = db.modulo
const Op = db.Sequelize.Op
const bcrypt = require('bcrypt')
const Pagination = require('./../functions/pagination');
const LdapAuth = require("../controllers/AuthLdapController.js");


exports.obtenerTodos = async(req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id_usuario', 'nombres', 'apellidos', 'correo', 'acceso', 'id_perfil', 'perfil.nombre'],
            include: ["perfil"]
        })
        return res.status(200).json({
            estado: true,
            usuarios
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: "Error al obtener los usuario."
        })
    }
};

exports.crear = async(req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const clave_encriptada = await bcrypt.hash(req.body.clave, salt)
        const datos_usuario = {
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            correo: req.body.correo,
            acceso: 'A',
            clave: clave_encriptada,
            id_perfil: req.body.id_perfil,
        }
        const usuarioValidado = await Usuario.findOne({
            where: {
                correo: req.body.correo
            }
        })
        if (usuarioValidado) {
            return res.status(422).json({
                error: "Correo de usuario ya existe."
            })
        }
        const usuario = await Usuario.create(datos_usuario)
        return res.status(201).json({
            estado: true,
            mensaje: "Se creó correctamente el usuario",
            data: usuario
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: "Error al crear el usuario."
        })
    }
};

exports.buscarUno = async(req, res) => {
    try {
        const id_usuario = req.params.id_usuario
        const usuario = await Usuario.findOne({
            attributes: ['id_usuario', 'nombres', 'apellidos', 'correo', 'acceso', 'id_perfil'],
            where: {
                id_usuario: id_usuario
            },
            include: ['perfil']
        })
        if (usuario) {
            return res.status(200).json({
                estado: true,
                usuario
            })
        }
        return res.status(404).send('El usuario con el ID especificado no existe')
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: "Error al obtener el usuario."
        })
    }
};

exports.actualizar = async(req, res) => {
    try {
        const id_usuario = req.params.id_usuario
        const usuario = await Usuario.findOne({
            where: {
                id_usuario: id_usuario
            },
            include: ['perfil']
        })
        if (usuario) {
            if (req.body.hasOwnProperty('clave')) {
                const salt = await bcrypt.genSalt(10)
                const clave_encriptada = await bcrypt.hash(req.body.clave, salt)
                req.body.clave = clave_encriptada
            }
            if (await Usuario.update(req.body, {
                    where: {
                        id_usuario: id_usuario
                    }
                })) {
                //const usuario = await Usuario.findOne({ where: { id_usuario: id_usuario } })
                return res.status(200).json({
                    estado: true,
                    mensaje: "Se actualizó correctamente el usuario"
                })
            }
        }
        return res.status(404).send('El usuario con el ID especificado no existe')
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            error: "Error al actualizar el usuario."
        })
    }
};

exports.eliminar = async(req, res) => {
    try {
        const id_usuario = req.params.id_usuario
        await Usuario.destroy({
            where: {
                id_usuario: id_usuario
            },
            force: true
        })
        return res.status(200).json({
            estado: true,
            mensaje: "Se eliminó correctamente el usuario"
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            error: "Error al eliminar el usuario."
        })
    }
};

exports.validarCredenciales = async(req, res) => {
    try {
        let res_ldap = await LdapAuth.Auth(req, res);
        let usuario = await Usuario.findOne({
            where: {
                [Op.and]: [{
                    correo: req.body.correo
                }]
            }
        })
        const perfil_default = process.env.DEFAULT_PERFIL;
        if (res_ldap.status == true) {
            if (!usuario && perfil_default){
                const salt = await bcrypt.genSalt(10)
                const clave_encriptada = await bcrypt.hash(req.body.clave, salt)
                const datos_usuario = {
                    nombres: "",
                    apellidos: "",
                    correo: req.body.correo,
                    acceso: 'A',
                    clave: clave_encriptada,
                    id_perfil: perfil_default,
                }
                usuario = await Usuario.create(datos_usuario);
            } else if (! await bcrypt.compare(req.body.clave, usuario.clave)){
                const salt = await bcrypt.genSalt(10)
                const clave_encriptada = await bcrypt.hash(req.body.clave, salt)
                await usuario.update({
                    clave: clave_encriptada
                });
            }
        }
        if ((usuario && usuario.acceso == "A" && await bcrypt.compare(req.body.clave, usuario.clave)) ) {
            const modulos = await Modulo.findAll()
            const perfil = await Perfil.findOne({
                where: {
                    id_perfil: usuario.id_perfil
                },
                include: ["submodulos"]
            })
            let accesos = modulos.filter((modulo) => {
                let submodulos = perfil.submodulos.filter((elemento) => elemento.id_modulo == modulo.id_modulo)
                if (submodulos.length > 0) {
                    modulo.setDataValue('submodulos', submodulos)
                    return true
                }
                return false
            })
            return res.status(200).json({
                estado: true,
                usuario: {
                    id_usuario: usuario.id_usuario,
                    nombres: usuario.nombres,
                    apellidos: usuario.apellidos,
                    id_perfil: usuario.id_perfil,
                    accesos: accesos
                }
            })
        }
        return res.status(401).send({
            mensaje: 'Usuario o contraseña incorrectos.'
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            error: "Error del servidor."
        })
    }
};