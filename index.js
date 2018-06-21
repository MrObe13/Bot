const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const fetch = require('node-fetch');
const awsAccessKeyID = require('./src/data/data.js');
const generateRequest = require('./src/amazonApi.js');
const getAmazonItemInfo = require('./example/generateSignature2.js');
const credentials = require('./src/data/data');
const xml = require("xml2js");

const bot = new Telegraf("566956085:AAG2S3ZwMYHTUoc_cg35CgME-iWOWoAratQ");
let code = "";
let parser = xml.parseString;

let res = response();
bot.on('message', (ctx) => ctx.telegram.sendMessage(175162940, ("message: " + res + "\nlink: " + code)));
// }
bot.startPolling();


async function response() {
    code = getAmazonItemInfo("B01DYN5N06", credentials.awsId, credentials.awsSecret, credentials.awsTag);
    const response = await fetch(code, {
        method: 'GET',
        headers: {
            'Accept': "text/xml",
            "Content-Type": "text/xml"
        },
    });
    console.log(response);
    if (response.status === 200) {
      return parser(response)
    }

}