const generateQueryString = require("../example/generateSignature");
const credentials = require('./data/data.js');

let params = {
    Service: "",
    AWSAccessKeyId: "",
    AssociateTag: "",
    Operation: "ItemLookup",
    ItemId: "",
    ResponseGroup: "Images%2CItemAttributes%2COffers%2CReviews",
    Version: "",
    Timestamp: "",
};

const endPoint = "http://webservices.amazon.it/";
const typeFormat = "onca/xml";
const query = "http://webservices.amazon.it//onca/xml?Service=AWSECommerceServic\n" +
    "e&AWSAccessKeyId=AKIAJCZSN5BQJTYAQNOA&Operation=ItemLookup&ItemId\n" +
    "=0679722769&ResponseGroup=ItemAttributes,Offers,Images,Reviews&Ve\n" +
    "rsion=2013-08-01"

let generateSignature = function (stringToSign, awsSecret) {
    let hmac = crypto.createHmac('sha256', awsSecret);
    return hmac.update(stringToSign).digest('base64');
};

let generateRequest = function () {
    return generateQueryString(query, 'ItemLookup', credentials);
};

module.exports = generateRequest;






