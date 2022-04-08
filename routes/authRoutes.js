const passport = require('passport')

module.exports = function authRoutes(app) {
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email'],
    }))

    app.get('/auth/google/redirect', passport.authenticate('google', {
        failureRedirect: '/failed',
    }), (req, res) => {
        res.redirect('/')
    })

    app.get('/logout', (req, res) => {
        console.log('dummy logout route')
        req.logout()
        res.redirect('/')
    })

    app.get('/failed', (req, res) => {
        res.send("Login failed")
    })

    //testing if user information has been recognized
    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    })
}

