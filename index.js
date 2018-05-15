const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const fetch = require('node-fetch');
const code = require('./data.js');

const bot = new Telegraf('581850076:AAHTA-IhMkOiks-KHtcaTm1Frz85vNh48_w');
bot.help((ctx) => ctx.reply('Help message'));
let response;
(async function response() {
    response = await fetch('http://webservices.amazon.it/onca/xml?Service=AWSECommerceService&AWSAccessKeyId=' + code + '&AssociateTag=grchan-21&Operation=ItemLookup&ItemId=B005U94MVY&Timestamp=2014-08-18T12:00:00Z', {
        method: 'GET',
        headers: {"Content-Type": "text/xml"},
    }).then((res) => {
        console.log(res)
        return res
    })
})();
console.log(code)
bot.on('message', (ctx) => ctx.telegram.sendMessage(ctx.from.id, ("message: " + response)));

bot.startPolling();
