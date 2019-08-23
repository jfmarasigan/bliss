const cheerio = require('cheerio');
const fs = require('fs');
const textConverter = require('./text-conversion');
const psign = require('./signature');
const util = require('./utils');

exports.handler = async (event) => {
    if (event.isPing) {
        console.log('Ping event');
        return;
    }
    
    console.log('Event: ', event);
    // read xml from file
    let xmlString = fs.readFileSync('./request.xml', 'utf-8');
    let $ = cheerio.load(xmlString, { xmlMode : true });
    let data = event.data;
    
    // set values
    $("mid").text(process.env.MERCHANT_ID);
    $("notification_url").text(process.env.NOTIFICATION_URL);
    $("response_url").text(process.env.RESPONSE_URL);
    $("cancel_url").text(process.env.CANCEL_URL);
    $("mtac_url").text(process.env.MTAC_URL);
    $("descriptor_note").text(process.env.DESCRIPTOR_NOTE);
    $("mlogo_url").text(process.env.MERCHANT_LOGO_URL);
    $("ip_address").text(process.env.IP);
    
    $("orders items Items amount").text(data.amount);
    $("orders items Items itemname").text(process.env.ITEM_NAME);
    $("fname").text(data.fname);
    $("lname").text(data.lname);
    $("mname").text(data.mname);
    $("address1").text(data.address);
    $("email").text(data.email);
    $("phone").text(util.toEmpty(data.phoneNo));    
    $("mobile").text(util.toEmpty(data.mobileNo));
    $("city").text(util.toEmpty(data.city));
    $("state").text(util.toEmpty(data.state));
    $("zip").text(data.zip.toString());
    $("amount").text(data.amount.toString());
    $("request_id").text(data.requestId);

    let secure3d = $("secure3d").text();
    let signature = createSignature(data, secure3d);
    $("signature").text(signature);

    let base64encoded = textConverter.encode($.xml().toString());
    
    return base64encoded;
};

/**
 * @param {Object} data 
 */
function createSignature(data, secure3d) {
    let signature = psign.generate({
        mid : process.env.MERCHANT_ID,
        request_id : data.requestId,
        ip_address : process.env.IP,
        notification_url : process.env.NOTIFICATION_URL,
        response_url : process.env.RESPONSE_URL,
        fname : data.fname,
        lname : data.lname,
        mname : data.mname,
        address1 : data.address,
        address2 : "",
        city : data.city,
        state : data.state,
        country : 'PH',
        zip : data.zip,
        email : data.email,
        phone : data.phoneNo,
        client_ip : "", //"210.5.110.29",
        amount : data.amount,
        currency : 'PHP',
        secure3d : secure3d,
        merchantKey : process.env.MERCHANT_KEY        
    });

    return signature;
}
