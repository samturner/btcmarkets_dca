const BTCMarkets = require('btc-markets')
const async      = require('async')
const _          = require('lodash')
const schedule   = require('node-schedule')

// load public and private keys from a json file
const KEYS = require('./keys.json')

// the total amount I want to spend each day
const WEEKLY_SPEND = 60

// the currency I want to buy in
const FIAT_CURR = "AUD"

// all values are in SATOSHIS
// https://en.bitcoin.it/wiki/Satoshi_(unit)
const SATOSHI = 100000000

// Portfolio breakdown
const TOKEN_PERCENT = {
  BTC: 0.4, // 40%
  ETH: 0.3, // 30%
  LTC: 0.3, // 30%
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
    var toSpend = WEEKLY_SPEND * TOKEN_PERCENT[coin]
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

console.log('---- Booting [Running every week] ----')

// run this function every sunday at 12AM (UTC)
var run = schedule.scheduleJob({hour: 0, minute: 0, dayOfWeek: 0}, function() {
  console.log('\n==== ' + new Date() + ' ====')
  getTokenPrices(buyHandler)
});
