"use strict";
// Code sourced from https://iangilham.com/2017/08/22/add-headers-with-lambda-edge.html
exports.handler = (event, context, callback) => {
    function add(h, k, v) {
        h[k.toLowerCase()] = [
            {
                key: k,
                value: v
            }
        ];
    }

    const response = event.Records[0].cf.response;
    const headers = response.headers;
    // HSTS (HTTP Strict Transport Security) header at 2 yrs 63072000; 1 yr 31536000;
    // Strict-Transport-Security: max-age=63072000; includeSubDomains;
    add(
        headers,
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload"
    );
    // Reduce XSS risks
    add(headers, "X-Content-Type-Options", "nosniff");
    add(headers, "X-XSS-Protection", "1; mode=block");
    add(headers, "X-Frame-Options", "DENY");
    add(headers, "Referrer-Policy", "no-referrer-when-downgrade");

    // TODO: fill in value of the sha256 hash
    const csp =
        "default-src 'none'" +
        "; frame-ancestors 'none'" +
        "; base-uri 'none'" +
        "; style-src 'self' 'unsafe-inline'" +
        "; img-src 'self' https:" +
        "; script-src 'strict-dynamic' 'sha256-my_script_hash' 'unsafe-inline' https:";
    //add(headers, "Content-Security-Policy", csp);

    console.log("Response headers added");
    callback(null, response);
};
