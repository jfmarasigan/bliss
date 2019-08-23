const fs = require('fs');
const properties = {
    from : 'CPI ECTPL <tester.acct.cpi@gmail.com>',
    subject : 'Your CTPL e-Contract',
    message : getMessage()
};

function getMessage() {
    let message = fs.readFileSync('./email-message.html', 'utf-8');
    return message;
}

module.exports = {
    properties : properties
};