const { validationResult } = require('express-validator');
const Role = require('./models/Role');
const User = require('./models/User');


class AuthController {
    create(req, res) {        
        new Promise((resolve, reject) => {
            const es = validationResult(req);  
            if(!es.isEmpty()) {
                reject(es);
            } else {
                resolve();
            }
        }).then(() =>
            new Role(
                { value: req.body.role }
            ).save()
        ).then((data) =>
            res.json(data)
        ).catch((e) =>
            res.status(400).json([e, req.body])
        );
    }

    getRoles(req, res) {
        Role.find().then((data) =>
            res.json(data)
        ).catch((e) =>
            res.status(400).json(e)
        );
    }

    delete(req, res) {
        Role.findOneAndDelete({ value:req.body.role }).then((data) =>
            res.json(data)
        ).catch((e) =>
            res.status(400).json(e)
        );
    }

    updateUserRole(req, res) {
        Role.findOne(
            {  value: req.body.role }
        ).then((role) => {
            if(!role) {
                throw new Error('role not found');
            }
            return User.findOneAndUpdate(
                { username: req.body.username },
                { $push: { roles: role._id } },
                { new: true },
            );
        }).then(data =>
            res.json(data)
        ).catch((e) =>
            res.status(400).json(e)
        );
    }
    
}


module.exports = new AuthController();