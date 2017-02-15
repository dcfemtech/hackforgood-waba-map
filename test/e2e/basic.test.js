//var config = require('../../nightwatch.conf.js');

module.exports = { // adapted from: https://git.io/vodU0
  //TODO: Write end to end tests
    'Guinea Pig Assert Title': function(browser) {
        browser
          .url('localhost:3000')
          .waitForElementVisible('body')
          .assert.title('WABA Bike Infrastructure Map Project')
          .end();
    }
};