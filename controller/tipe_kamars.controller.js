const tipeModel = require('../models/index').tipe_kamar
const Op = require('sequelize').Op
const bodyParser = require("body-parser")
const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const upload = require('./upload-foto-tipe_kamars').single(`foto`)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

exports.getAllType = async (request, response) => {
    let tipe = await tipeModel.findAll()
    return response.json({
        succsess: true,
        data: tipe,
        message: 'All tipe kamar have been loaded'
    })
}

exports.findType = async (request, response) => {
    let keyword = request.body.keyword

    let tipe = await tipeModel.findAll ({
        where: {
            [Op.or]: [
                {nama_tipe_kamar: {[Op.substring]: keyword}},
                {harga: {[Op.substring]: keyword}},
                {deskripsi: {[Op.substring]: keyword}},
                {foto: {[Op.substring]: keyword}},
            ]
        }
    })
    return response.json({
        succsess: true,
        data: tipe,
        message: 'Tipe kamar have been finded'
    })
}

exports.addType = (request, response) => {
    upload(request, response, async (error) => {
        if (error) {
            return response.json({message:error});
        } 
        let newType = {
            nama_tipe_kamar: request.body.nama_tipe_kamar,
            harga: Number(request.body.harga),
            deskripsi: request.body.deskripsi,
            foto: request.file.filename,
        }
        await tipeModel.create(newType)
            .then(result => {
                return response.json({
                    success: true,
                    data: result,
                    message: 'New tipe kamar have been added'
                });
            })
            .catch(error => {
                return response.json({
                    success: false,
                    message: error.message
                });
            }); 
    });
}

exports.updateType = (request, response) => {
    upload(request, response, async (error) => {
        if (error) {
            return response.json({
                success: false,
                message: error.message
            });
        } else {
            // If no error occurred during upload, continue processing the request.
            let id = request.params.id;
            let newTypes = {
                nama_tipe_kamar: request.body.nama_tipe_kamar,
                harga: Number(request.body.harga),
                deskripsi: request.body.deskripsi
            };

            if (request.file) {
                const selectedType = await tipeModel.findOne({ where: { id: id } });
                const oldFotoType = selectedType.foto;
                const pathFoto = path.join(__dirname, '../foto-tipe_kamars', oldFotoType);

                if (fs.existsSync(pathFoto)) {
                    fs.unlink(pathFoto, error => console.log(error));
                }
            }

            tipeModel.update(newTypes, { where: { id: id } })
                .then(result => {
                    return response.json({
                        success: true,
                        code: response.statusCode,
                        message: "Data has been updated"
                    });
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message
                    });
                });
        }
    });
}


exports.deleteType = async (request,response) => {
    let id = request.params.id

    const type = await tipeModel.findOne({where: {id : id}})
    const oldFotoType = type.foto
    const pathFoto = path.join(__dirname, '../foto-tipe_kamars', oldFotoType)
    if (fs.existsSync(pathFoto)){
        fs.unlink(pathFoto, error => console.log(error))
    }
    
    tipeModel.destroy({where: {id : id}})
        .then(result => {
            return response.json ({
                succsess : true,
                code : response.statusCode,
                message : "Data has been updated"
            })
        })
        .catch (error =>{
            return response.json({
                succsess : false,
                message : error.message
            })
        })
}