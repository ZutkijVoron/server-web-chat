const User = require('./models/User');
const Role = require('./models/Role');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { secret } = require('./config');


const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    };

    return jwt.sign(payload, secret, { expiresIn: '24h' });
};

class AuthController {
    registration(req, res) {
        const { username, password } = req.body;

        new Promise((resolve, reject) => {
            const es = validationResult(req);
            if (!es.isEmpty()) {
                reject(es);
            } else {
                resolve();
            }
        }).then(() =>
            User.findOne({ username })
        ).then((data) => {
            if (data) {
                throw new Error('there is already a username');
            }
            return Role.findOne({ value: 'user' });
        }).then((role) => {
            const hashPassword = bcryptjs.hashSync(password, 7);
            const user = new User(
                { username, password: hashPassword, roles: [role] }
            );
            return user.save();
        }).then((data) =>
            res.json(data)
        ).catch((e) =>
            res.status(400).json(e)
        );
    }

    login(req, res) {
        User.findOne(
            { username: req.body.username }
        ).then((user) => {
            if (!user ||
                !bcryptjs.compareSync(
                    req.body.password,
                    user.password
                )) {
                throw new Error('not valid username or password');
            }
            return generateAccessToken(user._id, user.roles);
        }).then((token) =>
            res.json(token)
        ).catch((e) =>
            res.status(400).json(e)
        );
    }

    getUsers(req, res) {
        User.find().then((data) =>
            res.json(data)
        ).catch((e) =>
            res.status(400).json(e)
        );
    }

    delete(req, res) {
        new Promise((resolve, reject) => {
            const es = validationResult(req);
            if (!es.isEmpty()) {
                reject(es);
            } else {
                resolve();
            }
        }).then(() =>
            User.findOneAndDelete(
                { username: req.body.username }
            )
        ).then((data) =>
            res.json(data)
        ).catch((e) =>
            res.status(400).json(e)
        );
    }
}


module.exports = new AuthController();