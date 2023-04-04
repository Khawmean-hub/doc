const jwt = require('jsonwebtoken')

// Authentication
var auth = {

    // for admin
    admin: function authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err || user.role != "2") return res.sendStatus(403)
            req.user = user
            next()
        })
    },

    // for user
    user: function authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err || user.role != "1") return res.sendStatus(403)
            req.user = user
            next()
        }) 
    },

    adminAndUser: function authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            if (user.role == "1" || user.role == "0") {
                req.user = user
                next()
            } else
                return res.sendStatus(403)


        })
    },

    // for all 
    permitAll: function authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            req.user = user
            next()
        })
    },

    // for not user only read
    readOnly: function authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err || user.role != "1" || user.role != "2" || user.role !="0") return res.sendStatus(403)
            req.user = user
            next()  
        })
    },
}


module.exports = auth