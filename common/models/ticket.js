'use strict';
var app = require('../../server/server')
var nodemailer = require('nodemailer');
var Config = require('../../server/config.json')
var QRcode =  require('qrcode');
var fs = require('fs')
 

module.exports = function(Ticket) {
    Ticket.remoteMethod(
        'mail',
        {
            accepts :[
                { arg : 'userId' , type : 'string' },
                { arg : 'ticketId' , type : 'string'}
            ],
            http : { path : '/mail/:userId/:ticketId', verb :'get'},
            returns : {arg : 'sent' , type :'boolean'}
        });
    Ticket.mail = async function (userId,ticketId) {
        const User = app.models.User;
        let res = await User.findById(userId);
        console.log(res)
        let email = res.email;
        console.log(email)

        let url = await QRcode.toFile("./ticket.jpg",ticketId );
        let transporter = nodemailer.createTransport(Config.mailer);

        let mailOptions = {
            from : Config.mailer.auth.user ,
            to : email,
            subject : 'test',
            html : `<h1>Here is your Ticket</h1> `,
            attachments : [
                {
                    filename : 'ticket.jpg',
                    content: fs.createReadStream('./ticket.jpg')
                }
            ]
        }
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error)
                fs.unlinkSync('./ticket.jpg')
                return {sent : false}
            }else{
                console.log('Email sent')
                return {sent : true}
            }
        })


    }
    
};
