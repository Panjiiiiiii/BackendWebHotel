const { request, response } = require("../routes/users.route")

const pemesanansModel = require(`../models/index`).pemesanan
const detaiModel = require(`../models/index`).detail_pemesanan
const Op = require(`sequelize`).Op

exports.addpemesanan = async (request, response) => {
    let newPemesanan = {
        nomor_pemesanan: request.body.nomor_pemesanan,
        nama_pemesanan: request.body.nama_pemesanan,
        email_pemesanan: request.body.email_pemesanan,
        tanggal_pemesanan: request.body.tanggal_pemesanan,
        tanggal_check_in: request.body.tanggal_check_in,
        tanggal_check_out: request.body.tanggal_check_out,
        nama_tamu: request.body.nama_tamu,
        jumlah_kamar: Number(request.body.jumlah_kamar),
        id_tipe_kamar: request.body.id_tipe_kamar,
        status_pemesanan: request.body.status_pemesanan,
        id_user: request.body.id_user
    }

    pemesanansModel.create(newPemesanan)
        .then(result => {
            let pemesananID = result.id
            let detailPemesanan = request.body.detail_pemesanan
            
            for (let i = 0; i < detailPemesanan.length; i++) {
                detailPemesanan[i].pemesananID = pemesananID
            }

            detaiModel.bulkCreate(detailPemesanan)
                .then(result => {
                    return response.json({
                        succsess : true,
                        message : `Kamar telah dipesan`
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

