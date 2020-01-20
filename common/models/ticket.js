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
        const Ticket = app.models.Ticket;
        const Show = app.models.Show;
        const Movie = app.models.Movie;

        let user = await User.findById(userId);
        console.log(user)
        let email = user.email;
        console.log(email)
        let ticket = await Ticket.findById(ticketId)
        console.log(ticket)
        let show = await Show.findById(ticket.showId);
        console.log(show)
        let movie = await Movie.findById(show.movieId);
        console.log(movie)

        let url = await QRcode.toFile("./ticket.jpg",`${ticketId}/${user.id}` );
        let transporter = nodemailer.createTransport(Config.mailer);

        let mailOptions = {
            from : Config.mailer.auth.user ,
            to : email,
            subject : 'test',
            html : `<h1>Here is your Ticket ${user.username} for the movie ${movie.title}</h1> `,
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
                fs.unlinkSync('./ticket.jpg')
                return {sent : true}
            }
        })


    }
    
};
