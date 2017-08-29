# BTCMarkets DCA

This repository is an example showing how to implement [Dollar-Cost Averaging](http://www.investopedia.com/terms/d/dollarcostaveraging.asp) (DCA) using the [BTCMarkets](https://www.btcmarkets.net) API in Node.js.

The strategy here is to purchase a number of cryptocurrencies at the same time every day regardless of the price.

### Getting Started

To get started, get your API keys for BTCMarkets and make sure the `keys.json` file is populated with both your public and private keys. Then, run `node buy.js` to start the application.

I'm using the [Forever](https://github.com/foreverjs/forever) package to keep this running indefinitely on my server. There are other (and probably better) ways to do it, this is up to you.

### Customisation

There are a few variables that you may want to customise in order to tailor this to your own portfolio and investment strategy:

`FIAT_CURR` - The currency you want to buy in, I'm using AUD, you might want to use something else. Must be supported by BTCMarkets

`DAILY_SPEND` - The total amount that you want to spend each day, in `FIAT_CURR`

`TOKEN_PERCENT` - Contains the coin ticker you want to purchase and the amount (as a percentage) of your daily spend you want to assign to it. Always ensure this adds to 100%. Remove rows if you don't want to purchase them.

You can also customise the `schedule.scheduleJob` method call to change how often buys are made.


### License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

### Dependencies

* [btc-markets](https://github.com/naddison36/btc-markets) - Node wrapper for the BTCMarkets API.
* [async](https://github.com/caolan/async) - Trying to avoid callback hell
* [lodash](https://github.com/lodash/lodash) - Collection manipulation
* [node-schedule](https://github.com/node-schedule/node-schedule) - Schedule the buy method to run at the same time every day
