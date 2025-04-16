const jwt = require('jsonwebtoken');
const { secret } = require('../config');


module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    Promise.resolve(
        req.headers.authorization?.split(/\s/)[1]
    ).then((token) => {
        if (!token) {
            token = req.query.token;
        }

        if (!token) {
            throw new Error('you need authorization');
        }
        req.user = jwt.verify(token, secret);
        next();
    }).catch(() =>
        res.status(403).json({ message: 'you need authorization' })
    );

};
