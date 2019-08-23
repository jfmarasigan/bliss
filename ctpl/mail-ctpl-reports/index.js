const nodemailer = require('nodemailer');
const attachment = require('./getS3Reports');
const polbasic = require('./query');
const mailer = require('./email-properties');

// event should contain :
// prefix - full folder directory of objects
exports.handler = async (event) => {
    try {
        console.log('Retrieving attachments...');
        let attachments = await attachment.getAttachments(process.env.BUCKET, event.prefix);
        console.log('Retrieving recipient...');
        let recipient = await polbasic.getRecipient(event.prefix);
        console.log('Initializing email sending process...');
        let result = await sendMail(recipient, attachments);
        console.log('Email sending done...');
        return result;
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
};

async function sendMail(recipient, attachments) {
    let reports = process.env.REPORTS.split(",,");
    let mailAttachments = [];
    for (let index = 0; index < reports.length; index++) {
        let item = {
            filename : reports[index] + process.env.REPORT_FILE_EXTENSION,
            content : attachments[index].Body
        };
        mailAttachments.push(item);
    }

    let mailOptions = {
        from : mailer.properties.from,
        to : recipient,
        subject : mailer.properties.subject,
        html : mailer.properties.message,
        attachments : mailAttachments
    };

    let transporter = getGmailTransporter();

    console.log("Sending mail...");
    let result = await transporter.sendMail(mailOptions)
        .then(response => {
            console.log('Email sent', response);
            response.messageAlt = 'Email successfully sent.';
            return response;
        }).catch(error => {
            console.error("Error: ", error);
            return error;
        });
    
    return result;
}

function getGmailTransporter() {
    return nodemailer.createTransport({
        service : 'gmail',
        auth : {
          user : process.env.SENDER,
          pass : process.env.SENDER_PASS
        }
    });
}

function getGmailTransporter2() {
    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.SENDER,
            pass: process.env.SENDER_PASS
        }
    });
}

function getYahooMailTransporter() {
    return nodemailer.createTransport({
        host: "smtp.mail.yahoo.com",
        port: 465,
        auth: {
            user: process.env.SENDER,
            pass: process.env.SENDER_PASS
        }
    });
}