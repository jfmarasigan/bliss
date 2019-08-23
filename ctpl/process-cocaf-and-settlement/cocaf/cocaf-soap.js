'use strict';
let cocafSOAP = {
    userAgent : "CPI-ECTPL/1.0 ECTPL Web Application by Computer Professionals Inc. PH",
    url : process.env.COCAF_URL,
    envelope : envelope
};

function envelope(cocData) {
    let envelope = 
        `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:api=\"http://api.isap.com/\">
        <soapenv:Header/>
        <soapenv:Body>
            <api:register>
                <arg0>
                    <assuredName>${cocData.pname}</assuredName>
                    <assuredTin>${cocData.tinNo}</assuredTin>
                    <chassisNo>${cocData.serialNo}</chassisNo>
                    <engineNo>${cocData.motorNo}</engineNo>
                    <expiryDate>${cocData.expiryDate}</expiryDate>
                    <inceptionDate>${cocData.inceptionDate}</inceptionDate>
                    <mvFileNo>${cocData.mvFileNo}</mvFileNo>
                    <mvPremType>${cocData.mvPremType}</mvPremType>
                    <mvType>${cocData.mvType}</mvType>
                    <password>${cocData.cocafPwd}</password>
                    <plateNo>${cocData.plateNo}</plateNo>
                    <regType>${cocData.regType}</regType>
                    <taxType>${cocData.vatTag}</taxType>
                    <username>${cocData.cocafUser}</username>
                    <cocNo>${cocData.cocNo}</cocNo>
                </arg0>
            </api:register>
        </soapenv:Body>
        </soapenv:Envelope>`;
    
    return envelope;
}

module.exports = cocafSOAP;