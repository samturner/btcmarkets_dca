const BTCMarkets = require('btc-markets');
const async      = require('async')
const _          = require('lodash')

// load the public and private keys from a json file
const KEYS = require('./keys.json')

// the total amount I want to spend each day
const DAILY_SPEND = 30

// the currency I want to buy in
const FIAT_CURR = "AUD"

// all values are in SATOSHIS
const SATOSHI = 100000000

// percentage of portfolio
const TOKEN_PERCENT = {
  BTC: 0.6,
  ETH: 0.3,
  LTC: 0.05,
  XRP: 0.05
}

var client = new BTCMarkets(KEYS.public, KEYS.secret)

console.log('\n==== ' + new Date() + ' ====')

/**
 * [Return an object that contains all the last prices for each token]
 */
function getTokenPrices(cb) {
  async.parallel({
      BTC: function(callback) {
        client.getTick('BTC', FIAT_CURR, function(e, res) {
          callback(e, res.lastPrice)
        })
      },
      ETH: function(callback) {
        client.getTick('ETH', FIAT_CURR, function(e, res) {
          callback(e, res.lastPrice)
        })
      },
      LTC: function(callback) {
        client.getTick('LTC', FIAT_CURR, function(e, res) {
          callback(e, res.lastPrice)
        })
      },
      XRP: function(callback) {
        client.getTick('XRP', FIAT_CURR, function(e, res) {
          callback(e, res.lastPrice)
        })
      }
  }, cb)
}

getTokenPrices(function(e, res) {
  if (e) {
    console.log('An error occurred when getting prices, cancelling for today...')
    return;
  }

  _.forIn(res, function(price, coin) {
    var toSpend = DAILY_SPEND * TOKEN_PERCENT[coin]
    var volume = toSpend / price

    var orderPrice = Math.round(price * SATOSHI)
    var orderVolume = Math.round(volume  * SATOSHI)

    console.log('--- ' + coin + ' ---')
    console.log('price: $' + price)
    console.log('spend: $' + toSpend)
    console.log('volume: ' + volume + ' ' + coin )

    client.createOrder(coin, FIAT_CURR, orderPrice, orderVolume, 'Bid', 'Limit', 'xx', function(e, res) {
      if (res.success) {
        console.log('ordered ' + volume + ' ' + coin + ' @ $' + price + ' -- [$' + toSpend + ']')
      } else {
        console.log('error placing ' + coin + ' order')
        console.log(res)
      }
    });
  })
})
