const Router = require('express');
const controller = require('./authController');
const { check } = require('express-validator');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');



const router = new Router();

router.post('/register', [
    check(
        'username',
        'the username cannot be empty and must be more than 4 characters long'
    ).notEmpty().isLength({ min: 4 }),
    check(
        'password',
        'the password cannot be empty and must be more than 8 characters long'
    ).notEmpty().isStrongPassword({ minLength: 8, })
], controller.registration);
router.post('/login', controller.login);
router.get('/users', authMiddleware, controller.getUsers);
router.delete('/users', [
    check(
        'username',
        'the username cannot be empty and must be more than 4 characters long'
    ).notEmpty().isLength({ min: 4 }),
    roleMiddleware(['admin'])
], controller.delete);

module.exports = router;
