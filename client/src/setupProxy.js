const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = {
    target: 'http://localhost:5000',
    // headers: {
    //   "Connection": "keep-alive"
    // },
    // changeOrigin: true
}

// setup conditional to use different keys!
if (process.env.NODE_ENV === 'production') {
  console.log('by passing hpm');
} else {
  console.log('setting HPM')
  module.exports = function(app) {
    app.use(
      [
        '/auth/google',
        '/api'
      ],
      createProxyMiddleware(proxy)
    );
  };
}


