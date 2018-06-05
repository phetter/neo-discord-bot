const { Command } = require('discord.js-commando');
const request = require('request');
const currency = require('currency-formatter');
const { getCoin } = require.main.require('./helpers');

module.exports = class CoincapCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'coincap',
      group: 'general',
      memberName: 'coincap',
      description: 'Shows more details for provided coin using CoinMarketCap.',
      examples: ['!coincap <COIN NAME>'],
      guildOnly: false
    });
  }

  async run(message) {
    const usersCoinInput = message.content.split(' ')[1];

    if (!usersCoinInput) {
      message.channel.send(`Require command of the form "!coincap <COIN NAME>"`);
      return;
    }

    const requestedCoin = getCoin(usersCoinInput);

    if (!requestedCoin) {
      message.channel.send('Unable to find provided coin');
      return;
    }

    request.get(
      {
        url: `https://api.coinmarketcap.com/v1/ticker/${requestedCoin.website_slug}/?convert=USD`,
        json: true
      },
      function(e, r, data) {
        if (Object.keys(data).length === 0) {
          message.channel.send('Unable to find provided coin');
          return;
        }

        if (!data || !data[0] || !data[0]['id']) {
          return;
        }

        const priceBtc = data[0].price_btc;
        const percentChange24h = data[0].percent_change_24h;
        const name = data[0].name;
        const id = data[0].id;
        const marketCapUsd = data[0].market_cap_usd;
        const priceUsd = data[0].price_usd;
        const maxSupply = data[0].max_supply;

        message.channel.send(
          `${name} (${id})\n${currency.format(priceUsd, {
            code: 'USD'
          })} (${priceBtc})  +/-: ${percentChange24h}%  Volume: ${currency.format(
            data[0]['24h_volume_usd'],
            { code: 'USD' }
          )}\nSupply: ${currency.format(maxSupply, {})}  Market Cap: ${currency.format(
            marketCapUsd,
            { code: 'USD' }
          )}`
        );
      }
    );
  }
};
