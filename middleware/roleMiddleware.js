const { secret } = require('../config');
const jwt = require('jsonwebtoken');
const Role = require('../models/Role');


module.exports = (roles) => (req, res, next) => {
    if (req.method === 'OPTIONS'){
        next();
    }
    Promise.resolve(
        req.headers.authorization?.split(/\s/)[1]
    ).then((token) => {
        if (!token) {
            throw new Error('you need authorization');
        }
        return Promise.all(jwt.verify(token, secret).roles.map(id =>
            Role.findById(id)
        ));
    }).then((userRoles) => {
        if(!userRoles.some((role) =>
            roles.includes(role.value)
        )) {
            throw new Error('you need more rights.');
        }
        next();
    }).catch(() =>
        res.status(403).json({message:'you need more rights.'})
    );

};