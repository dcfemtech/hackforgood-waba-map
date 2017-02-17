
module.exports = { // adapted from: https://git.io/vodU0
    'WABA Assert page title': function(browser) {
        browser
          .url('localhost:3000')
          .waitForElementVisible('body')
          .assert.title('WABA Bike Infrastructure Map Project')
    },
    'test for menu visibility': (browser) => {
        browser
            .url('localhost:3000')
            .waitForElementVisible('div#mapMenu')
            .end()
    }
};