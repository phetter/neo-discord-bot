const request = require('request');
const currency = require('currency-formatter');

module.exports = (client, message) => {
  request.get({
      url: 'https://api.coinmarketcap.com/v1/ticker/Antcoin/?convert=USD',
      json: true
    },
    function (e, r, prices) {
      const price = prices[0];
      message.channel.send(`The current GAS price is ${currency.format(price.price_usd, { code: 'USD' })}, B${price.price_btc} and rank ${price.rank}`);
    });
};