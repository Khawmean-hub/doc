const jwt = require('jsonwebtoken')

//Authentication
var auth = {
    //for admin
    admin : function authenticateToken(req, res, next){
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
    
        if(token == null) return res.sendStatus(401)
        
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
            if(err || user.role != "2") return res.sendStatus(403)
            req.user = user
            next()
        })
    },

    //for user
    user : function authenticateToken(req, res, next){
        const authHeader    = req.headers['authorization']
        const token         = authHeader && authHeader.split(' ')[1]
    
        if(token == null) return res.sendStatus(401)
        
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
            if(err || user.role != "1") return res.sendStatus(403)
            req.user = user
            next()
        })
    },


    // for all user
    permitAll: function authenticateToken(req, res, next){
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
    
        if(token == null) return res.sendStatus(401)
        
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
            if(err) return res.sendStatus(403)
            req.user = user
            next()
        })
    
        
    },
}


module.exports = auth