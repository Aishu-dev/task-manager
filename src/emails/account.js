
const formData = require('form-data');
const Mailgun = require("mailgun.js");

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY
});

const sendWelcomeEmail = (email, name) => {

    mg.messages.create(process.env.MAILGUN_API_KEY, {
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
    mg.messages.create(process.env.MAILGUN_API_KEY, {
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



