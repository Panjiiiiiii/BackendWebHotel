const express = require('express')
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const usersModel = require('../models/index').user
 

const authenticate = async (request, response) => {
    let datalogin = {
        email: request.body.email,
        password: md5(request.body.password)
    }

    let dataAdmin = await usersModel.findOne({where: datalogin})

    if(dataAdmin){
        let payload = JSON.stringify(dataAdmin)
        let secret = `mokleters`
        let token = jwt.sign(payload, secret)

        return response.json({
            succsess : true,
            logged: true,
            message: `Authentication Successed`,
            token : token,
            data: dataAdmin
        })
    }

    return response.json({
        success: false,
        logged: false,
        message: `Authentication Failed. Invalid email or password`
    })
}

module.exports = {authenticate}