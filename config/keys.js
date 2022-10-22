// setup conditional to use different keys!
if (process.env.NODE_ENV === 'production') {
    console.log('setting prod keys')
    module.exports = require('./prod')
} else {
    console.log('setting dev keys')
    module.exports = require('./dev')
}
