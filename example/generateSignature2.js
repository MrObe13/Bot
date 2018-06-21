let crypto = require('crypto');
let moment = require('moment');
//
// function sha256(stringToSign, secretKey) {
//     var hex = CryptoJS.HmacSHA256(stringToSign, secretKey);
//     return hex.toString(CryptoJS.enc.Base64);
// }

let sha256 = function (stringToSign, awsSecret) {
    return crypto.createHmac('SHA256', awsSecret).update(stringToSign).digest('base64')
};

function timestamp() {
    let date = new Date();
    let y = date.getUTCFullYear().toString();
    let m = (date.getUTCMonth() + 1).toString();
    let d = date.getUTCDate().toString();
    let h = date.getUTCHours().toString();
    let min = date.getUTCMinutes().toString();
    let s = date.getUTCSeconds().toString();

    if (m.length < 2) {
        m = "0" + m;
    }
    if (d.length < 2) {
        d = "0" + d;
    }
    if (h.length < 2) {
        h = "0" + h;
    }
    if (min.length < 2) {
        min = "0" + min;
    }
    if (s.length < 2) {
        s = "0" + s
    }

    date = y + "-" + m + "-" + d;
    let time = h + ":" + min + ":" + s;
    return date + "T" + time + "Z";
}

function getAmazonItemInfo(ASIN, PublicKey, PrivateKey, AssociateTag) {

    let parameters = [];
    parameters.push("AWSAccessKeyId=" + PublicKey);
    parameters.push("ItemId=" + ASIN);
    parameters.push("Operation=ItemLookup");
    parameters.push("Service=AWSECommerceService");
    //parameters.push("IdType=ASIN");
    parameters.push("Timestamp=" + encodeURIComponent(new Date().toISOString()));
    //parameters.push("Version=2018-06-18");
    parameters.push("AssociateTag=" + AssociateTag);

    parameters.sort();
    let paramString = parameters.join('&');

    let signingKey = "GET\n" + "webservices.amazon.it\n" + "/onca/xml\n" + paramString;

    let signature = sha256(signingKey, PrivateKey);
    signature = encodeURIComponent(signature);

    return "http://webservices.amazon.it/onca/xml?" + paramString + "&Signature=" + signature;
}

module.exports = getAmazonItemInfo;