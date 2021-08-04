const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//console.log(process.env.SENDGRID_API_KEY);

const sendInvoicePDF = async (email, name, invoicePDF) => {
    //console.log(invoicePDF);
    sgMail.send({
        to: email,
        from: 'nayanshrivastava800@gmail.com',
        subject: 'Invoice',
        text: `Invoice - ${name}`,
        attachments: [
            {
                filename: `invoice`,
                content: invoicePDF,
                type: 'application/pdf',
                disposition: 'attachment'
            }
        ]
    });
};

const sendWelcomeEmail = (email, name) => {
    //console.log(email, name);
    sgMail.send({
        to: email,
        from: 'nayanshrivastava800@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the our tasks app!, ${name}. Let us know how you get along with the app.`
    });
};

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'nayanshrivastava800@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    });
};

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail,
    sendInvoicePDF
};
