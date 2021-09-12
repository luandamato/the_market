const crypto = require('crypto');
var nodemailer = require('nodemailer');
const User = require('../src/models/User');

module.exports = {

	true_status:  function(res,body,msg)
	{
		res.status(200).json({
			'success':1,
			'code':200,
			'msg':msg,
			'data':body,
		});
		return false;
	},

	false_status: function(res, msg)
	{
		res.status(400).json({
			'success':0,
			'code':400,
			'msg':msg,
			'data':[],
		});
		return false;
	},
	wrong_status: function(res, msg)
	{
		res.status(400).json({
			'success':0,
			'code':400,
			'msg':msg,
			'data':{},
		});
		return false;
	},
	already_exist: function(res, msg)
	{
		res.status(409).json({
			'success':0,
			'code':409,
			'msg':msg,
			'data':{},
		});
		return false;
	},
	invalid_status: function(res, msg)
	{
		res.status(401).json({
			'success':0,
			'code':401,
			'msg':msg,
			'data':{},
		});
		return false;
	},
	unauth_status: function(res, msg)
	{
		res.status(401).json({
			'success':0,
			'code':401,
			'msg':msg,
			'data':{},
		});
		return false;
	},

    vaildObject: async function (required, non_required, res) {
        let message = '';
        let empty = [];
        
        for (let key in required) {
            if (required.hasOwnProperty(key)) {
                if (required[key] == undefined || required[key] == '') {
                    empty.push(key);
                }
            }
        }

        if (empty.length != 0) {
            message = empty.toString();
            if (empty.length > 1) {
                message += " são campos obrigatórios"
            } else {
                message += " é obrigatório"
            }
            res.status(400).json({
                'success': false,
                'msg': message,
                'code': 400,
                'body': {}
            });
            return;
        } else {

            const marge_object = Object.assign(required, non_required);
            delete marge_object.checkexit;

            for(let data in marge_object){
                if(marge_object[data]==undefined){
                    delete marge_object[data];
                }else{
                    if(typeof marge_object[data]=='string'){
                        marge_object[data]=marge_object[data].trim();
                    } 
                }
            }

            return marge_object;
        }
    },
	criptografar: async function(senha) {
        console.log(senha, "================reqdata.password")
        const converted_password = crypto.createHash('sha1').update(senha).digest('hex');
        console.log(converted_password,"converted_password");
        return converted_password;
    },

    mandarEmail: async function(email, res) {
        var data = await User.findOne({
            where: {
                email: email,
            }
        });
        

        if (data) {
            var email_password_get = {
                email_data: 'themarketlab0001@gmail.com',
                password_data: 'TheMarket@2021'
            }
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: email_password_get.email_data,
                    pass: email_password_get.password_data
                }
            });
            var otp = Math.floor(Math.random() * 10000);
            var mailOptions = {
                from: email_password_get.email_data,
                to: data.email,
                subject: "Código de verificação TheMarket",
                text: "Seu código é: " + otp + ' '
            };


            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log("erro ao mandar email: ")
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            var update_otp = await User.update({
                codigo: otp,
            }, {
                where: {
                    id: data.id
                }
            });

            return transporter;

        } else {
            let msg = "email não encontrado"
            false_status(res, msg)
        }

    },
}