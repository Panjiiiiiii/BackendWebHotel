const jsonwebtoken = require('jsonwebtoken')

const authVerify = async (request, response, next) => {
    try {
        const header = request.headers.authorization
        if(header == null){
            return response.status(400).json({
                message: "missing token",
                error : null
            })
        }

        let token = header.split(" ")[1]
        const SECRET_KEY = "secretcode"
        let decodedToken
        try{
            decodedToken = await jsonwebtoken.verify(token, SECRET_KEY)
        } catch (error) {
            if(error instanceof jsonwebtoken.TokenExpiredError){
                return response.status(400).json({
                    message: "token expired",
                    error : error
                })
            }
            return response.status(400).jsoon ({
                message: "Invalid token",
                error: error
            })
        }
        request.usersData = decodedToken;
        next()
    } catch (error) {
        console.log(error)
        return response.status(400).json({
            message: error
        })
    }
}

module.exports = {authVerify}