const checkRole = (allowedRoles) => {
    return (request, response, next) => {
        const userRole = request.userData.role
        if(allowedRoles.includes(userRole)){
            next()
        }else{
            return response.status(403).json({
                message: "Akses ditolak",
                err: null
            })
        }
    }
}

module.exports = {checkRole}