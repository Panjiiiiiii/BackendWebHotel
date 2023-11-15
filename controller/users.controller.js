const usersModel = require('../models/index').user
const Op = require('sequelize').Op
const md5 = require('md5')
const jsonwebtoken = require('jsonwebtoken')
const  SECRET_KEY = "secretcode"
const express = require('express')
const bodyParser = require("body-parser")
const app = express()
const path = require('path')
const fs = require('fs')
const { error } = require('console')
const upload = require('./upload-foto-users').single(`foto`)

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

exports.login = async (request, response) => {
    try {
        const params = {
            email: request.body.email,
            password : md5(request.body.password),
        }

        console.log(params)
        const findUser = await usersModel.findAll({where : params});
        if (findUser == null) {
            return response.status(400).json({
                message: "email or password doesn't match",
            })
        }

        let tokenPayload = {
            id_user: findUser.id,
            email : findUser.email,
            role: findUser.role,
            nama_user : findUser.nama_user,
        }
        tokenPayload = JSON.stringify(tokenPayload)
        let token = jsonwebtoken.sign(tokenPayload, SECRET_KEY)

        return response.status(200).json({
            message : "Login succsess",
            data: {
                token: token,
                id_user: findUser.id_user,
                nama_user: findUser.nama_user,
                email: findUser.email,
                role: findUser.role
            }
        })
    } catch (error) {
        console.log(error)
        return response.status(400).json({
            message : error
        })
    }
}

exports.getAllUsers = async (request, response) => {
    let users = await usersModel.findAll()
    console.log(users)
    return response.json({
        succsess: true,
        data: users,
        message: "All users have been loaded"
    })
}

exports.findUsers = async (request, response) => {
    let id = request.params.id

    if(!id){
        return response.status.json({
            success: false,
            message: "masukkan id user di url",
        });
    } else {
        let getUser = await usersModel.findAll ({
            where: {
                [Op.and]: [{id: idUser}]
            }
        })
        
        if(!getUser) {
            return response.status(400).json({
                success: false,
                message: "nothing user to show",
              });
        } else {
            return response.json({
                succsess: true,
                data: users,
                message: 'All data have been loaded'
            })
        }
    }

}

exports.RegisterCustomer = (request, response) => {
    upload(request, response, async (error) => {
        if(error) {
            return response.status(400).json({message : error})
        }
        if(!request.file){
            return response.status(400).json({
                message : `Upload foto dulu`
            })
        }

        let newCustomer = {
            nama_user : request.body.nama_user,
            foto : request.file.filename,
            email : request.body.email,
            password : md5(request.body.password),
            role : "customer"
        }

        let customer = await usersModel.findAll({
            where: {
                [Op.or]: [{nama_user : newCustomer.nama_user}, {email: newCustomer.email}]
            }
        })

        if(newCustomer.nama_user === "" || newCustomer.email === "" || newCustomer.password === ""){
            const oldFotoCustomer = newCustomer.foto
            const pathFoto = path.join(__dirname, `../foto-users`, oldFotoCustomer)
            if(fs.existsSync(pathFoto)) {
                fs.unlink(pathFoto, error => console.log(error))
            }

            return response.status(400).json({
                success: false,
                message: "Harap diisi semua data"
            })
        } else {
            if(customer.length > 0){
                const oldFotoCustomer = newCustomer.foto
                const pathFoto = path.join(__dirname, `../foto-users`, oldFotoCustomer)
                if(fs.existsSync(pathFoto)) {
                    fs.unlink(pathFoto, error => console.log(error))
                }

                return response.status(400).json({
                    success: false,
                    message: "New user has been inserted",
                })
            } else {
                console.log(newCustomer)
                usersModel.create(newCustomer)
                .then((result) => {
                    return response.json({
                        success: true,
                        data: result,
                        message: 'Customer baru telah ditambahkan'
                    })
                })
                .catch((error) => {
                    return response.status(400).json({
                        success: false,
                        message: error.message
                    })
                })
            }
        }
    })
}

exports.LoginRegister = async (request, response) => {
    const email = request.body.email
    const password = md5(request.body.password)
    let user = await usersModel.findAll({
        where: { role: "customer", email: email}
    })

    if(user.length === 0){
        let newUser = {
            nama_user : request.body.nama_user,
            foto : request.body.foto,
            email : email,
            role : "customer"
        }
        if(newUser.nama_user === "" || newUser.email === ""){
            return response.status(400).json({
                succsess: false,
                message: "Harus diisi semua"
            })
        } else {
            usersModel.create(newUser)
            .then ((result) => {
                return response.json({
                    succsess: true,
                    data: result,
                    message: "New user has been inserted",
                })
            })
            .catch ((error) => {
                return response.status(400).json({
                    succsess: false,
                    message: error.message
                })
            })
        }
    } else {
        return response.json({
            succsess : true,
            data : user,
            message: 'User sudah ada dan berhasil login'
        })
    }
}


exports.addUsers = (request, response) => {
    upload(request,response, async (error) => {
        if(error){
            return response.json({message:error});
        }
        let newUsers = {
            nama_user : request.body.nama_user,
            foto : request.file.filename,
            email : request.body.email,
            password : md5(request.body.password),
            role : request.body.role
        }
        await usersModel.create(newUsers)
            .then (result => {
                return response.json({
                    succsess : true,
                    data : result,
                    message : 'New user have been added'
                })
            })
            .catch(error => {
                return response.json({
                    succsess : false,
                    message : error.message
                })
            })
    })
}

exports.updateUsers = (request, response) => {
    upload(request, response, async (error) => {
        if (error) {
            return response.json({
                success: false,
                message: error.message
            });
        } else {        
            let id = request.params.id

            let newUsers = {
                nama_user : request.body.nama_user,
                foto : request.body.foto,
                email : request.body.email,
                role : request.body.role
            }

            if (request.file) {
                const selectedType = await tipeModel.findOne({ where: { id: id } });
                const oldFotoType = selectedType.foto;
                const pathFoto = path.join(__dirname, '../foto-users', oldFotoType);

                if (fs.existsSync(pathFoto)) {
                    fs.unlink(pathFoto, error => console.log(error));
                }
            }

            usersModel.update(newUsers, {where: {id : id}})
                .then(result => {
                    return response.json({
                        succsess : true,
                        message : 'Data has been updated'
                    })
                })
                .catch(error => {
                    return response.json ({
                        succsess : false,
                        message : error.message
                    })
                })
        }
    });
}

exports.deleteUsers = async (request, response) => {

    let id = request.params.id

    const type = await tipeModel.findOne({where: {id : id}})
    const oldFotoType = type.foto
    const pathFoto = path.join(__dirname, '../foto-users', oldFotoType)
    if (fs.existsSync(pathFoto)){
        fs.unlink(pathFoto, error => console.log(error))
    }

    usersModel.destroy({where : {id : id}})
        .then(result => {
            return response.json({
                succsess : true,
                message : 'Data has been deleted'
            })
        })
        .catch(error => {
            return response.json ({
                succsess : false,
                message : error.message
            })
        })
}