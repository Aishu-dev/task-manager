
const formData = require('form-data');
const Mailgun = require("mailgun.js");

const mailgunApiKey = 'deafd6b7508710ac70bbf39fc795a8a8-7ecaf6b5-91811e06'

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || mailgunApiKey
});


const sendWelcomeEmail = (email, name) => {

    mg.messages.create('sandbox0f52df06aee649198968a01c3f481e3d.mailgun.org', {
        from: 'Excited User <hoxoyi2204@tanlanav.com>',
        to: email,
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    }).then((res) => {
        console.log(res);
    }).catch((error) => {
        console.log(error);
    })

};

const sendCancelationEmail = (email, name) => {
    mg.messages.create('sandbox0f52df06aee649198968a01c3f481e3d.mailgun.org', {
        from: 'Excited user <hoxoyi2204@tanlanav.com>',
        to: email,
        subject: 'Good Bye!',
        text: `Good Bye ${name}, see you soon!`
    }).then((res) => {
        console.log(res);
    }).catch((error) => {
        console.log(error);
    });
};

module.exports = {
    sendWelcomeEmail, sendCancelationEmail
}



