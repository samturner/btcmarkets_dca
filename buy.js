const BTCMarkets = require('btc-markets')
const async      = require('async')
const _          = require('lodash')
const schedule   = require('node-schedule')

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
  BTC: 0.5, // 50%
  ETH: 0.2, // 20%
  LTC: 0.1, // 10%
  // Remaining 20% is in altcoins
}

var client = new BTCMarkets(KEYS.public, KEYS.secret)

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
      }
  }, cb)
}

/**
 * [buyHandler Take the token prices and submit orders in proportion]
 */
function buyHandler(e, res) {
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

    client.createOrder(coin, FIAT_CURR, orderPrice, orderVolume, 'Bid', 'Limit', null, function(e, res) {
      if (res.success) {
        console.log('ordered ' + volume + ' ' + coin + ' @ $' + price + ' -- [$' + toSpend + ']')
      } else {
        console.log('error placing ' + coin + ' order')
        console.log(res)
      }
    });
  })
}

// ==== MAIN ====

console.log('---- Booting [Running every day at 12 AM] ----')

// run this function every day at 12AM
var run = schedule.scheduleJob({hour: 0, minute: 0}, function() {
  console.log('\n==== ' + new Date() + ' ====')
  getTokenPrices(buyHandler)
});
