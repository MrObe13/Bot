let crypto = require('crypto');

let generateSignature = function (stringToSign, awsSecret) {
    let hmac = crypto.createHmac('sha256', awsSecret);
    return hmac.update(stringToSign).digest('base64');
};

let sort = function (object) {
    let sortedObject = {};
    let keys = Object.keys(object).sort();
    for (let i = 0; i < keys.length; i++) {
        sortedObject[keys[i]] = object[keys[i]];
    }
    return sortedObject;
};

let capitalize = function (string) {
    return string[0].toUpperCase() + string.slice(1)
};

let setDefaultParams = function (params, defaultParams) {
    for (let param in defaultParams) {
        if (typeof params[param] === 'undefined') {
            params[param] = defaultParams[param];
        }
    }
    return params;
};

let formatQueryParams = function (query, method, credentials) {
    let params = {};

    // format query keys
    for (let param in query) {
        let capitalized = capitalize(param);
        params[capitalized] = query[param];
    }

    if (method === 'ItemSearch') {
        // Default
        params = setDefaultParams(params, {
            SearchIndex: 'All',
            Condition: 'All',
            ResponseGroup: 'ItemAttributes',
            Keywords: '',
            ItemPage: '1'
        });

    } else if (method === 'ItemLookup') {
        // Default
        params = setDefaultParams(params, {
            SearchIndex: 'All',
            Condition: 'All',
            ResponseGroup: 'ItemAttributes',
            IdType: 'ASIN',
            IncludeReviewsSummary: 'True',
            TruncateReviewsAt: '1000',
            VariationPage: 'All'
        });

        // Constraints
        // If ItemId is an ASIN (specified by IdType), a search index cannot be specified in the request.
        if (params['IdType'] === 'ASIN') {
            delete params['SearchIndex'];
        }

    } else if (method === 'BrowseNodeLookup') {
        // Default
        params = setDefaultParams(params, {
            BrowseNodeId: '',
            ResponseGroup: 'BrowseNodeInfo'
        });
    } else if (method === 'SimilarityLookup') {
        // Default
        params = setDefaultParams(params, {
            SimilarityType: 'Intersection',
            ResponseGroup: 'ItemAttributes'
        });
    }

    // Constants
    params['Version'] = '2013-08-01';

    // Common params
    params['AWSAccessKeyId'] = credentials.awsId;
    // awsTag is associated with domain, so it ought to be defineable in query.
    params['AssociateTag'] = query.awsTag || credentials.awsTag;
    params['Timestamp'] = new Date().toISOString();
    params['Service'] = 'AWSECommerceService';
    params['Operation'] = method;

    // sort
    params = sort(params);

    return params;
};

let generateQueryString = function (query, method, credentials) {
    let unsignedString;
    let domain = query.domain || 'webservices.amazon.it';
    let params = formatQueryParams(query, method, credentials);
    // generate query
    unsignedString = Object.keys(params).map(function (key) {
        return key + "=" + encodeURIComponent(params[key]).replace(/[!'()*]/g, function (c) {
            return '%' + c.charCodeAt(0).toString(16);
        });
    }).join("&");

    let signature = encodeURIComponent(generateSignature('GET\n' + domain + '\n/onca/xml\n' + unsignedString, credentials.awsSecret)).replace(/\+/g, '%2B');
    return 'http://' + domain + '/onca/xml?' + unsignedString + '&Signature=' + signature;
};

module.exports = generateQueryString;
exports.formatQueryParams = formatQueryParams;