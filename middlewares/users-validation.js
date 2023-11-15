const Joi = require('joi')
const validateuser = (request, response, next) => {
    const rules = Joi
    .object()
    .keys({
        nama_user: Joi.string().required,
        foto: Joi.string().required,
        email: Joi.string().required,
        password: Joi.string().required,
        role: Joi.string().valid('admin', 'resepsionis', 'customer')
    })
    .options({abortEarly: false})

    let {error} = rules.validate(request.body)

    if(error != null){
        let errMessage = error.details.map(it => it.message).join(",")
        return response.status(422).json({
            succsess: false,
            message: errMessage
        })
    }
    next()
}

module.exports = {validateuser}